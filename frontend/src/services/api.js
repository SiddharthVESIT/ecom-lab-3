import axios from 'axios';

const API_BASE = 'http://localhost:4000/api/v1';

export const api = axios.create({
    baseURL: API_BASE,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('amai_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const getProducts = async (category = '') => {
    const url = category ? `/products?category=${encodeURIComponent(category)}` : '/products';
    const response = await api.get(url);
    return response.data.data || [];
};

export const getProductById = async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data.data;
};

export const loginUser = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
        localStorage.setItem('amai_token', response.data.token);
    }
    return response.data;
};

export const registerUser = async (fullName, email, password) => {
    const response = await api.post('/auth/register', { fullName, email, password });
    if (response.data.token) {
        localStorage.setItem('amai_token', response.data.token);
    }
    return response.data;
};

export const getCart = async () => {
    const response = await api.get('/cart');
    return response.data;
};

export const addToCart = async (productId, quantity = 1) => {
    const response = await api.post('/cart/items', { productId, quantity });
    return response.data;
};

export const removeFromCart = async (itemId) => {
    const response = await api.delete(`/cart/items/${itemId}`);
    return response.data;
};

export const createOrder = async (shippingDetails) => {
    const response = await api.post('/orders', shippingDetails);
    return response.data;
};

export const downloadInvoice = async (orderId) => {
    const response = await api.get(`/orders/${orderId}/invoice`, { responseType: 'blob' });
    return response.data;
};

export const getOrders = async () => {
    const response = await api.get('/orders');
    return response.data.data || [];
};
// Admin API

export const getAdminOrders = async () => {
    const response = await api.get('/admin/orders');
    return response.data.data;
};

export const getAdminOrderDetails = async (orderId) => {
    const response = await api.get(`/admin/orders/${orderId}/details`);
    return response.data.data;
};

export const updateOrderStatus = async (id, status) => {
    const response = await api.put(`/admin/orders/${id}`, { status });
    return response.data.data;
};

export const getAdminInventory = async () => {
    const response = await api.get('/admin/inventory');
    return response.data.data;
};

export const updateInventory = async (id, stock_count) => {
    const response = await api.put(`/admin/inventory/${id}`, { stock_count });
    return response.data.data;
};
