import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { getAdminOrders, getAdminOrderDetails, updateOrderStatus, getAdminInventory, updateInventory, getAdminCustomers, getAdminStats, getAdminSales } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
    const { user, loading: authLoading } = useAuth();
    const [activeTab, setActiveTab] = useState('inventory');
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [sales, setSales] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Order expansion state
    const [expandedOrder, setExpandedOrder] = useState(null);
    const [orderDetails, setOrderDetails] = useState({});
    const [loadingDetails, setLoadingDetails] = useState(false);

    // Editing state for inventory
    const [editingProduct, setEditingProduct] = useState(null);
    const [editStockCount, setEditStockCount] = useState('');

    useEffect(() => {
        if (!user || user.role !== 'admin') return;

        const fetchData = async () => {
            setLoading(true);
            try {
                const statsData = await getAdminStats();
                setStats(statsData);

                if (activeTab === 'inventory') {
                    const data = await getAdminInventory();
                    setProducts(data);
                } else if (activeTab === 'orders') {
                    const data = await getAdminOrders();
                    setOrders(data);
                } else if (activeTab === 'customers') {
                    const data = await getAdminCustomers();
                    setCustomers(data);
                } else if (activeTab === 'sales') {
                    const data = await getAdminSales();
                    setSales(data);
                }
            } catch (err) {
                setError(err.message || 'Failed to generic data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [activeTab, user]);

    if (authLoading) return <div className="text-center py-20">Loading authentication...</div>;

    // Protect route
    if (!user || user.role !== 'admin') {
        return <Navigate to="/" />;
    }

    const handleUpdateOrderStatus = async (orderId, newStatus) => {
        try {
            await updateOrderStatus(orderId, newStatus);
            setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        } catch (err) {
            alert('Failed to update order status');
        }
    };

    const handleToggleOrderDetails = async (orderId) => {
        if (expandedOrder === orderId) {
            setExpandedOrder(null);
            return;
        }

        setExpandedOrder(orderId);
        if (!orderDetails[orderId]) {
            setLoadingDetails(true);
            try {
                const details = await getAdminOrderDetails(orderId);
                setOrderDetails(prev => ({ ...prev, [orderId]: details }));
            } catch (err) {
                alert('Could not fetch order details');
            } finally {
                setLoadingDetails(false);
            }
        }
    };

    const handleUpdateStockClick = (product) => {
        setEditingProduct(product.id);
        setEditStockCount(product.stock_count);
    };

    const handleSaveStock = async (productId) => {
        try {
            const numStock = parseInt(editStockCount, 10);
            if (isNaN(numStock) || numStock < 0) {
                alert('Invalid stock count');
                return;
            }

            await updateInventory(productId, numStock);
            setProducts(products.map(p => p.id === productId ? { ...p, stock_count: numStock } : p));
            setEditingProduct(null);
        } catch (err) {
            alert('Failed to update stock');
        }
    };

    return (
        <div className="flex-grow w-full max-w-[1440px] mx-auto px-4 md:px-10 py-8">
            <h1 className="text-3xl font-black mb-8 text-zen-black dark:text-white">Admin Dashboard</h1>

            {/* Tabs */}
            <div className="flex gap-4 mb-8 border-b border-zen-highlight dark:border-zen-highlight-dark pb-2">
                <button
                    onClick={() => setActiveTab('inventory')}
                    className={`font-bold pb-2 border-b-2 transition-colors ${activeTab === 'inventory' ? 'border-primary text-primary' : 'border-transparent text-zen-brown dark:text-gray-400 hover:text-zen-black dark:hover:text-white'}`}
                >
                    Inventory
                </button>
                <button
                    onClick={() => setActiveTab('orders')}
                    className={`font-bold pb-2 border-b-2 transition-colors ${activeTab === 'orders' ? 'border-primary text-primary' : 'border-transparent text-zen-brown dark:text-gray-400 hover:text-zen-black dark:hover:text-white'}`}
                >
                    Orders
                </button>
                <button
                    onClick={() => setActiveTab('customers')}
                    className={`font-bold pb-2 border-b-2 transition-colors ${activeTab === 'customers' ? 'border-primary text-primary' : 'border-transparent text-zen-brown dark:text-gray-400 hover:text-zen-black dark:hover:text-white'}`}
                >
                    Customers
                </button>
                <button
                    onClick={() => setActiveTab('sales')}
                    className={`font-bold pb-2 border-b-2 transition-colors ${activeTab === 'sales' ? 'border-primary text-primary' : 'border-transparent text-zen-brown dark:text-gray-400 hover:text-zen-black dark:hover:text-white'}`}
                >
                    Sales Analytics
                </button>
            </div>

            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white dark:bg-[#1a160d] p-6 rounded-xl border border-zen-highlight dark:border-zen-highlight-dark flex flex-col items-center justify-center">
                        <span className="text-4xl material-symbols-outlined text-primary mb-2">payments</span>
                        <p className="text-zen-brown dark:text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">Total Revenue</p>
                        <p className="text-3xl font-black text-zen-black dark:text-white">${(stats.revenue_cents / 100).toFixed(2)}</p>
                    </div>
                    <div className="bg-white dark:bg-[#1a160d] p-6 rounded-xl border border-zen-highlight dark:border-zen-highlight-dark flex flex-col items-center justify-center">
                        <span className="text-4xl material-symbols-outlined text-blue-500 mb-2">shopping_bag</span>
                        <p className="text-zen-brown dark:text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">Total Orders</p>
                        <p className="text-3xl font-black text-zen-black dark:text-white">{stats.total_orders}</p>
                    </div>
                    <div className="bg-white dark:bg-[#1a160d] p-6 rounded-xl border border-zen-highlight dark:border-zen-highlight-dark flex flex-col items-center justify-center">
                        <span className={`text-4xl material-symbols-outlined mb-2 ${stats.low_stock_count > 0 ? 'text-red-500' : 'text-green-500'}`}>inventory_2</span>
                        <p className="text-zen-brown dark:text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">Low Stock Alerts</p>
                        <p className="text-3xl font-black text-zen-black dark:text-white">{stats.low_stock_count}</p>
                    </div>
                </div>
            )}

            {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">{error}</div>}

            {loading ? (
                <div className="text-center py-10">Loading data...</div>
            ) : (
                <div className="bg-white dark:bg-[#1a160d] rounded-xl border border-zen-highlight dark:border-zen-highlight-dark overflow-hidden">
                    {activeTab === 'inventory' && (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-zen-black dark:text-gray-200">
                                <thead className="bg-[#f8f8f6] dark:bg-[#221d10] text-xs uppercase font-bold text-zen-brown dark:text-gray-400">
                                    <tr>
                                        <th className="px-6 py-4">ID / SKU</th>
                                        <th className="px-6 py-4">Product Name</th>
                                        <th className="px-6 py-4">Category</th>
                                        <th className="px-6 py-4">Price</th>
                                        <th className="px-6 py-4">Stock</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((product) => (
                                        <tr key={product.id} className="border-b border-zen-highlight dark:border-zen-highlight-dark hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4 font-mono text-xs">{product.id.substring(0, 8)}</td>
                                            <td className="px-6 py-4 font-bold">{product.name}</td>
                                            <td className="px-6 py-4 capitalize">{product.category.replace('_', ' ')}</td>
                                            <td className="px-6 py-4">${(product.price_cents / 100).toFixed(2)}</td>
                                            <td className="px-6 py-4">
                                                {editingProduct === product.id ? (
                                                    <input
                                                        type="number"
                                                        value={editStockCount}
                                                        onChange={(e) => setEditStockCount(e.target.value)}
                                                        className="w-20 p-1 border rounded bg-transparent dark:text-white dark:border-gray-600"
                                                    />
                                                ) : (
                                                    <span className={`font-bold ${product.stock_count < 10 ? 'text-red-500' : 'text-green-600'}`}>
                                                        {product.stock_count}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {editingProduct === product.id ? (
                                                    <div className="flex justify-end gap-2">
                                                        <button onClick={() => setEditingProduct(null)} className="text-xs text-zen-brown hover:text-black dark:text-gray-400 dark:hover:text-white">Cancel</button>
                                                        <button onClick={() => handleSaveStock(product.id)} className="text-xs text-primary font-bold hover:text-yellow-600">Save</button>
                                                    </div>
                                                ) : (
                                                    <button onClick={() => handleUpdateStockClick(product)} className="text-xs font-bold text-primary hover:text-yellow-600 uppercase tracking-wider">
                                                        Edit Stock
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {products.length === 0 && (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-8 text-center text-zen-brown">No products found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'orders' && (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-zen-black dark:text-gray-200">
                                <thead className="bg-[#f8f8f6] dark:bg-[#221d10] text-xs uppercase font-bold text-zen-brown dark:text-gray-400">
                                    <tr>
                                        <th className="px-6 py-4">Order ID</th>
                                        <th className="px-6 py-4">Date</th>
                                        <th className="px-6 py-4">Customer</th>
                                        <th className="px-6 py-4">Total</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Update Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => (
                                        <React.Fragment key={order.id}>
                                            <tr className="border-b border-zen-highlight dark:border-zen-highlight-dark hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                                                <td className="px-6 py-4 font-mono text-xs">{order.id.substring(0, 8)}</td>
                                                <td className="px-6 py-4">{new Date(order.created_at).toLocaleDateString()}</td>
                                                <td className="px-6 py-4">
                                                    <div className="font-bold">{order.customer_name}</div>
                                                    <div className="text-xs opacity-70">{order.customer_email}</div>
                                                </td>
                                                <td className="px-6 py-4 font-medium">${(order.total_amount_cents / 100).toFixed(2)}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                        order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                                            order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                                'bg-gray-100 text-gray-800'
                                                        }`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right flex items-center justify-end gap-2">
                                                    <select
                                                        className="p-1.5 text-xs bg-transparent border border-zen-highlight dark:border-gray-600 rounded cursor-pointer outline-none"
                                                        value={order.status}
                                                        onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                                                    >
                                                        <option value="pending" className="text-black">Pending</option>
                                                        <option value="shipped" className="text-black">Shipped</option>
                                                        <option value="completed" className="text-black">Completed</option>
                                                        <option value="cancelled" className="text-black">Cancelled</option>
                                                    </select>
                                                    <button onClick={() => handleToggleOrderDetails(order.id)} className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors text-zen-brown dark:text-gray-400">
                                                        <span className="material-symbols-outlined text-lg">
                                                            {expandedOrder === order.id ? 'expand_less' : 'expand_more'}
                                                        </span>
                                                    </button>
                                                </td>
                                            </tr>
                                            {expandedOrder === order.id && (
                                                <tr className="bg-[#fafaf8] dark:bg-[#15120a] border-b border-zen-highlight dark:border-zen-highlight-dark">
                                                    <td colSpan="6" className="px-6 py-4">
                                                        {loadingDetails && !orderDetails[order.id] ? (
                                                            <div className="text-sm text-zen-brown">Loading items...</div>
                                                        ) : orderDetails[order.id]?.length > 0 ? (
                                                            <div className="pl-4 border-l-2 border-primary/30">
                                                                <h4 className="text-xs font-bold uppercase tracking-wider text-zen-brown dark:text-gray-400 mb-3">Purchased Items</h4>
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                    {orderDetails[order.id].map(item => (
                                                                        <div key={item.id} className="flex justify-between items-center text-sm p-3 bg-white dark:bg-[#1a160d] border border-zen-highlight dark:border-gray-800 rounded-lg">
                                                                            <div>
                                                                                <div className="font-bold">{item.product_name}</div>
                                                                                <div className="text-xs text-zen-brown flex gap-2">
                                                                                    <span>SKU: {item.product_sku}</span>
                                                                                    <span>Qty: {item.quantity}</span>
                                                                                </div>
                                                                            </div>
                                                                            <div className="font-medium">${(item.price_at_purchase_cents / 100).toFixed(2)}</div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="text-sm text-zen-brown">No item details found for this order.</div>
                                                        )}
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))}
                                    {orders.length === 0 && (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-8 text-center text-zen-brown">No orders found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                    
                    {activeTab === 'customers' && (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-zen-black dark:text-gray-200">
                                <thead className="bg-[#f8f8f6] dark:bg-[#221d10] text-xs uppercase font-bold text-zen-brown dark:text-gray-400">
                                    <tr>
                                        <th className="px-6 py-4">ID</th>
                                        <th className="px-6 py-4">Name</th>
                                        <th className="px-6 py-4">Email</th>
                                        <th className="px-6 py-4">Joined</th>
                                        <th className="px-6 py-4">Total Orders</th>
                                        <th className="px-6 py-4 text-right">Lifetime Value</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {customers.map((customer) => (
                                        <tr key={customer.id} className="border-b border-zen-highlight dark:border-zen-highlight-dark hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4 font-mono text-xs">{customer.id.substring(0, 8)}</td>
                                            <td className="px-6 py-4 font-bold max-w-xs truncate">
                                                {customer.full_name}
                                                {customer.lifetime_value_cents > 10000 ? (
                                                    <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-500">🥇 Gold VIP</span>
                                                ) : customer.lifetime_value_cents >= 5000 ? (
                                                    <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400">🥈 Silver</span>
                                                ) : (
                                                    <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-orange-50 text-orange-800 dark:bg-orange-900/30 dark:text-orange-500">🥉 Bronze</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">{customer.email}</td>
                                            <td className="px-6 py-4">{new Date(customer.joined_date).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 font-bold">{customer.total_orders}</td>
                                            <td className="px-6 py-4 text-right font-medium text-emerald-600 dark:text-emerald-400">
                                                ${(customer.lifetime_value_cents / 100).toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                    {customers.length === 0 && (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-8 text-center text-zen-brown">No customers found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'sales' && (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-zen-black dark:text-gray-200">
                                <thead className="bg-[#f8f8f6] dark:bg-[#221d10] text-xs uppercase font-bold text-zen-brown dark:text-gray-400">
                                    <tr>
                                        <th className="px-6 py-4">Product Name</th>
                                        <th className="px-6 py-4">Category</th>
                                        <th className="px-6 py-4 text-center">Units Sold</th>
                                        <th className="px-6 py-4 text-right">Revenue Generated</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sales.map((item, idx) => (
                                        <tr key={idx} className="border-b border-zen-highlight dark:border-zen-highlight-dark hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4 font-bold">{item.product_name}</td>
                                            <td className="px-6 py-4 capitalize">{item.category.replace('_', ' ')}</td>
                                            <td className="px-6 py-4 text-center font-bold text-blue-600 dark:text-blue-400">{item.total_units_sold}</td>
                                            <td className="px-6 py-4 text-right font-medium text-emerald-600 dark:text-emerald-400">
                                                ${(item.total_revenue_cents / 100).toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                    {sales.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-8 text-center text-zen-brown">No sales data found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
