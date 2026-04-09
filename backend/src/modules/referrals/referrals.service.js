import { query } from '../../config/db.js';

export async function getMyReferrals(userId) {
  const { rows } = await query(`
    SELECT r.id, r.created_at, r.reward_granted, u.full_name, u.email 
    FROM referrals r
    JOIN users u ON r.referee_id = u.id
    WHERE r.referrer_id = $1
    ORDER BY r.created_at DESC
  `, [userId]);
  return rows;
}

export async function verifyReferralCode(code) {
  const { rows } = await query('SELECT id FROM users WHERE referral_code = $1', [code]);
  return rows.length > 0;
}

export async function applyReferralCode(userId, code) {
  // Check if code exists
  const referrer = await query('SELECT id FROM users WHERE referral_code = $1', [code]);
  if (referrer.rows.length === 0) {
    throw new Error('Invalid referral code');
  }
  
  const referrerId = referrer.rows[0].id;
  
  if (referrerId === userId) {
    throw new Error('Cannot use your own referral code');
  }

  // Check if already used THIS specific code
  const existing = await query('SELECT id FROM referrals WHERE referee_id = $1 AND referral_code = $2', [userId, code]);
  if (existing.rows.length > 0) {
    throw new Error('You have already applied THIS referral code');
  }

  // Record referral and add points
  await query('BEGIN');
  try {
    // Referrer gets 200 beans
    await query('UPDATE users SET loyalty_points = loyalty_points + 200 WHERE id = $1', [referrerId]);
    // Referee gets 100 beans
    await query('UPDATE users SET loyalty_points = loyalty_points + 100 WHERE id = $1', [userId]);
    
    await query(
      'INSERT INTO referrals (referrer_id, referee_id, referral_code, status, reward_granted) VALUES ($1, $2, $3, $4, $5)',
      [referrerId, userId, code, 'completed', true]
    );
    
    await query('COMMIT');
    return { success: true, pointsAwarded: 100 };
  } catch (error) {
    await query('ROLLBACK');
    throw error;
  }
}
