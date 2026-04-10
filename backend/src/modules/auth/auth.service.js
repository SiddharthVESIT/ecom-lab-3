import bcrypt from 'bcrypt';
import { query } from '../../config/db.js';
import { createUser, findUserByEmail } from './auth.repository.js';
import { signToken } from '../../utils/jwt.js';
import admin from '../../utils/firebaseAdmin.js';

function generateReferralCode(fullName) {
  const prefix = (fullName.split(' ')[0] || 'AMAI').toUpperCase();
  const randomSuffix = Math.floor(100 + Math.random() * 900);
  return `${prefix}${randomSuffix}`;
}

export async function registerUser({ fullName, email, password, referralCodeUsed }) {
  const existing = await findUserByEmail(email);
  if (existing) {
    throw new Error('Email is already registered');
  }

  const newReferralCode = generateReferralCode(fullName);
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await createUser({ fullName, email, passwordHash, referralCode: newReferralCode });

  // Handle Referral Reward
  if (referralCodeUsed) {
    const referrer = await query('SELECT id FROM users WHERE referral_code = $1', [referralCodeUsed]);
    if (referrer.rows.length > 0) {
      const referrerId = referrer.rows[0].id;
      // Award 200 points to referrer
      await query('UPDATE users SET loyalty_points = loyalty_points + 200 WHERE id = $1', [referrerId]);
      // Award 100 points to referee (new user)
      await query('UPDATE users SET loyalty_points = loyalty_points + 100 WHERE id = $1', [user.id]);
      // Log referral
      await query(
        'INSERT INTO referrals (referrer_id, referee_id, referral_code, status, reward_granted) VALUES ($1, $2, $3, $4, $5)',
        [referrerId, user.id, referralCodeUsed, 'completed', true]
      );
      // Update local user object for the response
      user.loyalty_points = (user.loyalty_points || 0) + 100;
    }
  }

  const token = signToken({ sub: user.id, email: user.email, role: user.role });

  return { 
    user: { 
      id: user.id, 
      fullName: user.full_name, 
      email: user.email, 
      role: user.role, 
      flavorProfile: user.flavor_profile,
      loyaltyPoints: user.loyalty_points,
      referralCode: user.referral_code,
      isClubMember: user.is_club_member || false
    }, 
    token 
  };
}

export async function loginUser({ email, password }) {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isValid = await bcrypt.compare(password, user.password_hash);
  if (!isValid) {
    throw new Error('Invalid credentials');
  }

  const token = signToken({ sub: user.id, email: user.email, role: user.role });

  return {
    token,
    user: {
      id: user.id,
      fullName: user.full_name,
      email: user.email,
      role: user.role,
      flavorProfile: user.flavor_profile,
      loyaltyPoints: user.loyalty_points,
      referralCode: user.referral_code,
      isClubMember: user.is_club_member || false
    }
  };
}

export async function loginWithGoogleToken(idToken) {
  if (!admin) {
    throw new Error('Firebase Admin is not initialized.');
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { email, name, picture, uid } = decodedToken;

    let user = await findUserByEmail(email);
    
    // If user does not exist, create a new one
    if (!user) {
      const randomPassword = Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-10);
      const passwordHash = await bcrypt.hash(randomPassword, 12);
      const newReferralCode = generateReferralCode(name || 'Google User');
      user = await createUser({ fullName: name || 'Google User', email, passwordHash, referralCode: newReferralCode });
    }

    const token = signToken({ sub: user.id, email: user.email, role: user.role });

    return {
      token,
      user: {
        id: user.id,
        fullName: user.full_name,
        email: user.email,
        role: user.role,
        flavorProfile: user.flavor_profile,
        loyaltyPoints: user.loyalty_points,
        referralCode: user.referral_code,
        isClubMember: user.is_club_member || false,
        picture: picture || null
      }
    };
  } catch (error) {
    console.error('Error verifying Google ID logic:', error);
    throw new Error('Invalid Google token');
  }
}
