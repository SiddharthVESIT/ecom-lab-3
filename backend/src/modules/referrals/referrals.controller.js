import * as referralsService from './referrals.service.js';

export async function getMyReferrals(req, res) {
  try {
    const userId = req.user.sub;
    const data = await referralsService.getMyReferrals(userId);
    return res.status(200).json({ data });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export async function verifyReferralCode(req, res) {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ message: 'Code is required' });
    
    const isValid = await referralsService.verifyReferralCode(code);
    return res.status(200).json({ valid: isValid });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export async function applyReferralCode(req, res) {
  try {
    const { code } = req.body;
    const userId = req.user.sub;
    if (!code) return res.status(400).json({ message: 'Code is required' });

    const result = await referralsService.applyReferralCode(userId, code);
    return res.status(200).json({ message: 'Referral applied successfully', data: result });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}
