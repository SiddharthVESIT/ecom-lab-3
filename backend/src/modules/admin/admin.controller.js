import * as adminService from './admin.service.js';

export async function getOrders(req, res) {
    try {
        const orders = await adminService.getAdminOrders();
        return res.status(200).json({ data: orders });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export async function getOrderDetails(req, res) {
    try {
        const orderDetails = await adminService.getAdminOrderDetails(req.params.id);
        return res.status(200).json({ data: orderDetails });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export async function updateOrder(req, res) {
    try {
        const { status } = req.body;
        if (!status) return res.status(400).json({ message: 'status is required' });
        const order = await adminService.updateOrder(req.params.id, status);
        return res.status(200).json({ data: order });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export async function getInventory(req, res) {
    try {
        const products = await adminService.getAdminInventory();
        return res.status(200).json({ data: products });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export async function updateInventory(req, res) {
    try {
        const { stock_count } = req.body;
        if (stock_count === undefined) return res.status(400).json({ message: 'stock_count is required' });
        const product = await adminService.updateInventory(req.params.id, stock_count);
        return res.status(200).json({ data: product });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export async function getCustomers(req, res) {
    try {
        const customers = await adminService.getCustomers();
        return res.status(200).json({ data: customers });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export async function getStats(req, res) {
    try {
        const stats = await adminService.getDashboardStats();
        return res.status(200).json({ data: stats });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export async function getSalesAnalytics(req, res) {
    try {
        const sales = await adminService.getSalesAnalytics();
        return res.status(200).json({ data: sales });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
