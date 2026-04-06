import * as adminRepo from './admin.repository.js';
export * from './admin.repository.js';
import { redisClient } from '../../config/redis.js';

export async function getAdminOrders() {
    return await adminRepo.getAllOrders();
}

export async function getAdminOrderDetails(orderId) {
    return await adminRepo.getOrderDetails(orderId);
}

export async function updateOrder(id, status) {
    const order = await adminRepo.updateOrderStatus(id, status);
    if (!order) throw new Error('Order not found');
    return order;
}

export async function getAdminInventory() {
    return await adminRepo.getAllProducts();
}

export async function updateInventory(id, stockCount) {
    const product = await adminRepo.updateProductStock(id, stockCount);
    if (!product) throw new Error('Product not found');

    // Clear all product caches when inventory updates
    try {
        if (redisClient.isOpen) {
            const keys = await redisClient.keys('products:*');
            if (keys.length > 0) {
                await redisClient.del(keys);
            }
        }
    } catch (err) {
        // Ignore cache error
    }

    return product;
}

export async function getCustomers() {
    return await adminRepo.getCustomersAnalytics();
}

export async function getDashboardStats() {
    return await adminRepo.getDashboardStats();
}

export async function getSalesAnalytics() {
    return await adminRepo.getProductSalesAnalytics();
}
