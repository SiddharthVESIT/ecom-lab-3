import { query } from '../../config/db.js';

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
