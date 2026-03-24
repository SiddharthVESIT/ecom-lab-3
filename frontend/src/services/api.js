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

export const getProducts = async (category = '', flavorProfile = '') => {
    let url = '/products';
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (flavorProfile) params.append('flavor_profile', flavorProfile);
    if (params.toString()) url += `?${params.toString()}`;
    
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

export const logoutUser = async () => {
    const response = await api.post('/auth/logout');
    localStorage.removeItem('amai_token');
    return response.data;
};

export const loginWithGoogle = async (idToken) => {
    const response = await api.post('/auth/google', { idToken });
    if (response.data.token) {
        localStorage.setItem('amai_token', response.data.token);
    }
    return response.data;
};

export const updateFlavorProfile = async (flavorProfile) => {
    const response = await api.put('/users/profile/flavor', { flavorProfile });
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

export const getAdminCustomers = async () => {
    const response = await api.get('/admin/customers');
    return response.data.data;
};

export const getAdminStats = async () => {
    const response = await api.get('/admin/stats');
    return response.data.data;
};

export const getAdminSales = async () => {
    const response = await api.get('/admin/sales-analytics');
    return response.data.data;
};

// Payment API
export const createPaymentOrder = async (amount) => {
    const response = await api.post('/payment/create-order', { amount });
    return response.data;
};

export const verifyPayment = async (verificationData) => {
    const response = await api.post('/payment/verify', verificationData);
    return response.data;
};
