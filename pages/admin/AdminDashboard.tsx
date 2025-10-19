import React from 'react';
import { useProducts, useAuth } from '../../App';
import { mockOrders } from '../../data/orders';

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white p-6 rounded-xl border border-gray-200/80 shadow-sm flex items-center gap-5">
        <div className="bg-gray-100 rounded-full h-12 w-12 flex items-center justify-center text-black">
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-black">{value}</p>
        </div>
    </div>
);

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const statusClasses = status === 'Shipped'
        ? 'bg-blue-100 text-blue-800'
        : status === 'Delivered'
        ? 'bg-green-100 text-green-800'
        : 'bg-yellow-100 text-yellow-800';

    return (
        <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${statusClasses}`}>
            {status}
        </span>
    );
};

const AdminDashboard: React.FC = () => {
    const { products } = useProducts();
    const { users } = useAuth();

    const totalSales = mockOrders.reduce((acc, order) => {
        const value = parseFloat(order.total.replace('$', ''));
        return acc + value;
    }, 0).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    
    const totalOrders = mockOrders.length;
    const totalProducts = products.length;
    const totalUsers = users.length;
    const recentOrders = mockOrders.slice(0, 5);

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
                <StatCard 
                    title="Total Sales" 
                    value={totalSales} 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>}
                />
                 <StatCard 
                    title="Total Orders" 
                    value={totalOrders} 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>}
                />
                 <StatCard 
                    title="Total Products" 
                    value={totalProducts} 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>}
                />
                 <StatCard 
                    title="Total Users" 
                    value={totalUsers} 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197m0 0A5.995 5.995 0 0012 12a5.995 5.995 0 00-3-5.197M15 21a6 6 0 00-9-5.197" /></svg>}
                />
            </div>

            <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm">
                <div className="border-b border-gray-200/80 px-6 py-5">
                    <h2 className="text-xl font-bold text-black">Recent Orders</h2>
                    <p className="text-sm text-gray-500 mt-1">A quick look at the latest customer orders.</p>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm text-left">
                        <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                            <tr>
                                <th scope="col" className="px-6 py-3 font-semibold">Order ID</th>
                                <th scope="col" className="px-6 py-3 font-semibold">Customer</th>
                                <th scope="col" className="px-6 py-3 font-semibold">Status</th>
                                <th scope="col" className="px-6 py-3 font-semibold text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200/80">
                            {recentOrders.map(order => (
                                <tr key={order.id}>
                                    <td className="px-6 py-4 font-semibold text-black whitespace-nowrap">#{order.id}</td>
                                    <td className="px-6 py-4 text-gray-700 whitespace-nowrap">{order.customer}</td>
                                    <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={order.status} /></td>
                                    <td className="px-6 py-4 text-gray-800 whitespace-nowrap text-right">{order.total}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;