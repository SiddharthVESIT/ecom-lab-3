import { loginUser, registerUser } from './auth.service.js';

export async function register(req, res) {
  try {
    const { fullName, email, password } = req.body;
    const result = await registerUser({ fullName, email, password });
    return res.status(201).json(result);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const result = await loginUser({ email, password });
    return res.status(200).json(result);
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
}

export function session(req, res) {
  return res.status(200).json({
    message: 'Session active',
    user: req.user
  });
}
