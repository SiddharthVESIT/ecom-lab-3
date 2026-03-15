import * as orderService from './order.service.js';

export async function createOrder(req, res) {
    try {
        const { shippingAddress, billingAddress } = req.body;
        const userId = req.user.sub;

        const order = await orderService.processCheckout(userId, shippingAddress, billingAddress);
        return res.status(201).json({ message: 'Order created successfully', data: order });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}
