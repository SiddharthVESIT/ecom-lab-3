import * as orderService from './order.service.js';
import * as orderRepo from './order.repository.js';
import { generateInvoicePDF } from '../../utils/invoiceGenerator.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function getMyOrders(req, res) {
    try {
        const userId = req.user.sub || req.user.id;
        const orders = await orderService.getUserOrders(userId);
        return res.status(200).json({ data: orders });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export async function createOrder(req, res) {
    try {
        const { shippingAddress, billingAddress, appliedPoints = 0 } = req.body;
        const userId = req.user.sub || req.user.id;

        // 1. Process checkout (creates order as pending)
        const order = await orderService.processCheckout(userId, shippingAddress, billingAddress, appliedPoints);
        
        // 2. Mock Payment Processing Delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // 3. Mark Order as PAID
        await orderRepo.updateOrderStatus(order.id, 'paid');
        order.status = 'paid';
        
        // 4. Generate Invoice PDF
        const items = await orderRepo.getOrderItems(order.id);
        await generateInvoicePDF(order.id, order.total_cents, items, order.discount_paise);

        return res.status(201).json({ message: 'Order created and payment successful', data: order, success: true });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

export function downloadInvoice(req, res) {
    const orderId = req.params.orderId;
    const filePath = path.join(__dirname, `../../../invoices/${orderId}.pdf`);
    
    if (fs.existsSync(filePath)) {
        res.download(filePath);
    } else {
        res.status(404).json({ message: 'Invoice not found' });
    }
}
