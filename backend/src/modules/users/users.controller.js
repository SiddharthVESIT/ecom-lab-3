import { query } from '../../config/db.js';
import { findUserById } from '../auth/auth.repository.js';

export async function getUserProfile(req, res) {
  try {
    const user = await findUserById(req.user.sub);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Auto-generate missing legacy referral codes
    if (!user.referral_code) {
        const prefix = (user.full_name?.split(' ')[0] || 'AMAI').toUpperCase();
        const newCode = `${prefix}${Math.floor(100 + Math.random() * 900)}`;
        await query('UPDATE users SET referral_code = $1 WHERE id = $2', [newCode, user.id]);
        user.referral_code = newCode;
    }

    // Implicit Club Membership logic based on engagement
    const isClubMember = (user.loyalty_points && user.loyalty_points > 0);

    return res.status(200).json({
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        role: user.role,
        flavorProfile: user.flavor_profile,
        loyaltyPoints: user.loyalty_points,
        referralCode: user.referral_code,
        isClubMember: isClubMember
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export async function updateFlavorProfile(req, res) {
  try {
    const userId = req.user.sub;
    const { flavorProfile } = req.body;

    if (!flavorProfile) {
      return res.status(400).json({ message: 'flavorProfile is required' });
    }

    const result = await query(
      'UPDATE users SET flavor_profile = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [flavorProfile, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updatedUser = result.rows[0];
    return res.status(200).json({
      message: 'Flavor profile updated successfully',
      user: {
        id: updatedUser.id,
        fullName: updatedUser.full_name,
        email: updatedUser.email,
        role: updatedUser.role,
        flavorProfile: updatedUser.flavor_profile
      }
    });

  } catch (error) {
    console.error('Error updating flavor profile:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export async function getAdminCustomers(req, res) {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const { rows } = await query(`
      SELECT 
        u.id, 
        u.full_name, 
        u.email, 
        u.created_at as joined_date,
        u.loyalty_points,
        COUNT(o.id) as total_orders,
        COALESCE(SUM(o.total_amount_cents), 0) as lifetime_value_cents
      FROM users u
      LEFT JOIN orders o ON u.id = o.user_id AND o.status IN ('completed', 'paid')
      WHERE u.role != 'admin'
      GROUP BY u.id
      ORDER BY lifetime_value_cents DESC
    `);
    
    // Process cluster flags
    const processed = rows.map(r => ({
      ...r,
      isClubMember: (r.loyalty_points > 0)
    }));

    return res.status(200).json({ data: processed });
  } catch (error) {
    console.error('Error fetching admin customers:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
