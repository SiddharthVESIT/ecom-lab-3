import bcrypt from 'bcrypt';
import { createUser, findUserByEmail } from './auth.repository.js';
import { signToken } from '../../utils/jwt.js';
import admin from '../../utils/firebaseAdmin.js';

export async function registerUser({ fullName, email, password }) {
  const existing = await findUserByEmail(email);
  if (existing) {
    throw new Error('Email is already registered');
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await createUser({ fullName, email, passwordHash });
  const token = signToken({ sub: user.id, email: user.email, role: user.role });

  return { user: { id: user.id, fullName: user.full_name, email: user.email, role: user.role, flavorProfile: user.flavor_profile }, token };
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
      flavorProfile: user.flavor_profile
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
      // Use a random password for Google-authenticated users
      const randomPassword = Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-10);
      const passwordHash = await bcrypt.hash(randomPassword, 12);
      user = await createUser({ fullName: name || 'Google User', email, passwordHash });
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
        picture: picture || null
      }
    };
  } catch (error) {
    console.error('Error verifying Google ID logic:', error);
    throw new Error('Invalid Google token');
  }
}
