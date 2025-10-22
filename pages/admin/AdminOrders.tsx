import React, { useState } from 'react';
import { mockOrders } from '../../data/orders';

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


const AdminOrders: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredOrders = mockOrders.filter(order =>
        order.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm">
            <div className="border-b border-gray-200/80 px-6 py-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-xl font-bold text-black">Order Management</h2>
                    <p className="text-sm text-gray-500 mt-1">View and manage all customer orders.</p>
                </div>
                 <div className="relative w-full sm:max-w-xs">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Search by Order ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-black text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-colors"
                    />
                </div>
            </div>
            <div className="overflow-x-auto horizontal-scrollbar">
                <table className="min-w-full text-sm text-left">
                    <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                        <tr>
                            <th scope="col" className="px-6 py-3 font-semibold">Order ID</th>
                            <th scope="col" className="px-6 py-3 font-semibold">Customer</th>
                            <th scope="col" className="px-6 py-3 font-semibold">Date</th>
                            <th scope="col" className="px-6 py-3 font-semibold">Status</th>
                            <th scope="col" className="px-6 py-3 font-semibold text-right">Total</th>
                            <th scope="col" className="px-6 py-3 font-semibold text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200/80">
                        {filteredOrders.length > 0 ? (
                            filteredOrders.map(order => (
                                <tr key={order.id}>
                                    <td className="px-6 py-4 font-semibold text-black whitespace-nowrap">#{order.id}</td>
                                    <td className="px-6 py-4 text-gray-700 whitespace-nowrap">{order.customer}</td>
                                    <td className="px-6 py-4 text-gray-700 whitespace-nowrap">{order.date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={order.status} /></td>
                                    <td className="px-6 py-4 text-gray-800 whitespace-nowrap text-right">{order.total}</td>
                                    <td className="px-6 py-4 text-center">
                                        <button className="font-semibold text-black hover:underline">View Details</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="text-center py-16 px-6">
                                    <div className="text-gray-500">
                                        <p className="font-semibold">No orders found</p>
                                        <p className="text-sm mt-1">Try adjusting your search query.</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminOrders;