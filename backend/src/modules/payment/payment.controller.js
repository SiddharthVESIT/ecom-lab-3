import Razorpay from 'razorpay';
import crypto from 'crypto';

export async function createRazorpayOrder(req, res) {
  try {
    const { amount } = req.body; // Amount should be in rupees (or base currency)
    
    // Check if keys are configured
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({ message: 'Razorpay keys are not configured in .env' });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: amount * 100, // Razorpay expects amount in smallest unit (paise)
      currency: "INR",
      receipt: `rcpt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function verifyRazorpayPayment(req, res) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      // Payment is successful. Here you would typically update the order status in the database.
      return res.status(200).json({ message: "Payment verified successfully", verified: true });
    } else {
      return res.status(400).json({ message: "Invalid signature sent!", verified: false });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
