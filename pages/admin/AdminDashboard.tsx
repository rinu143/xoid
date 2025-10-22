
import React, { useMemo } from 'react';
import { useProducts, useAuth } from '../../App';
import { mockOrders } from '../../data/orders';
import { Product } from '../../types';

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

// --- New Analytics Components ---

const AnalyticsCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-white p-6 rounded-xl border border-gray-200/80 shadow-sm">
        <h3 className="text-lg font-bold text-black mb-4">{title}</h3>
        {children}
    </div>
);

interface ChartData {
    label: string;
    value: number;
}

const BarChart: React.FC<{ data: ChartData[], yLabel?: string }> = ({ data, yLabel = '' }) => {
    const maxValue = Math.max(...data.map(d => d.value), 1); // Avoid division by zero

    return (
        <div className="h-64 flex items-end justify-around space-x-4">
            {data.map(item => (
                <div key={item.label} className="flex-1 text-center flex flex-col justify-end items-center h-full">
                    <div 
                        className="w-full bg-black rounded-t-md transition-all duration-500 ease-out hover:bg-gray-700"
                        style={{ height: `${(item.value / maxValue) * 100}%` }}
                        title={`${yLabel}${item.value.toLocaleString()}`}
                    >
                    </div>
                    <span className="mt-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">{item.label}</span>
                </div>
            ))}
        </div>
    );
};

// FIX: Update the prop type for the BestSellers component to include the 'totalSold' property, resolving a TypeScript error.
const BestSellers: React.FC<{ products: (Product & { totalSold: number })[] }> = ({ products }) => (
    <AnalyticsCard title="Best Sellers">
        <div className="space-y-4">
            {products.slice(0, 4).map((product, index) => (
                <div key={product.id} className="flex items-center gap-4">
                    <img src={product.imageUrls[0]} alt={product.name} className="w-12 h-16 object-cover rounded-md bg-gray-100"/>
                    <div className="flex-grow">
                        <p className="font-semibold text-sm text-black">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.totalSold} units sold</p>
                    </div>
                     <span className="text-lg font-bold text-gray-300">#{index + 1}</span>
                </div>
            ))}
        </div>
    </AnalyticsCard>
);

const LowStockAlerts: React.FC<{ products: Product[] }> = ({ products }) => (
    <AnalyticsCard title="Low Stock Alerts">
        <div className="space-y-3">
            {products.length > 0 ? products.slice(0, 5).map(product => (
                <div key={product.id} className="flex justify-between items-center text-sm">
                    <p className="font-medium text-black">{product.name}</p>
                    <span className={`font-bold px-2 py-0.5 rounded-md text-xs ${product.stock <= 2 ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {product.stock} left
                    </span>
                </div>
            )) : <p className="text-sm text-gray-500 text-center py-8">All products are well-stocked!</p>}
        </div>
    </AnalyticsCard>
);


// --- Main Admin Dashboard Component ---

const AdminDashboard: React.FC = () => {
    const { products } = useProducts();
    const { users } = useAuth();

    // --- Data Processing for Analytics ---

    const { salesData, trafficData, bestSellers, lowStockProducts, totalSales, totalOrders } = useMemo(() => {
        // Sales Data
        const salesByMonth: { [key: string]: number } = mockOrders.reduce((acc, order) => {
            const month = new Date(order.date).toLocaleString('default', { month: 'short' });
            const value = parseFloat(order.total.replace('₹', '').replace(/,/g, ''));
            acc[month] = (acc[month] || 0) + value;
            return acc;
        }, {} as { [key: string]: number });
        
        const salesData = Object.entries(salesByMonth).map(([label, value]) => ({ label, value }));
        
        // Mock Traffic Data for the last 7 days
        const trafficData = [
            { label: 'Mon', value: 1843 },
            { label: 'Tue', value: 2102 },
            { label: 'Wed', value: 2439 },
            { label: 'Thu', value: 2280 },
            { label: 'Fri', value: 2987 },
            { label: 'Sat', value: 3412 },
            { label: 'Sun', value: 3105 },
        ];
        
        // Best Sellers Data
        const salesCounts = mockOrders
          .flatMap(order => order.items)
          .reduce((acc, item) => {
            acc[item.id] = (acc[item.id] || 0) + item.quantity;
            return acc;
          }, {} as {[key: number]: number});

        const bestSellers = Object.entries(salesCounts)
            .map(([productId, totalSold]) => {
                const product = products.find(p => p.id === parseInt(productId));
                return product ? { ...product, totalSold } : null;
            })
            .filter((p): p is Product & { totalSold: number } => p !== null)
            .sort((a, b) => b.totalSold - a.totalSold);

        // Low Stock Data
        const lowStockProducts = products
            .filter(p => p.stock > 0 && p.stock <= 5)
            .sort((a, b) => a.stock - b.stock);

        // Recalculate stats here for consistency
        const totalSales = '₹' + mockOrders.reduce((acc, order) => acc + parseFloat(order.total.replace('₹', '').replace(/,/g, '')), 0)
            .toLocaleString('en-IN');
        const totalOrders = mockOrders.length;
        
        return { salesData, trafficData, bestSellers, lowStockProducts, totalSales, totalOrders };
    }, [products]);

    const totalProducts = products.length;
    const totalUsers = users.length;

    return (
        <div className="space-y-8">
            {/* Stat Cards */}
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

            {/* Analytics Dashboards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <AnalyticsCard title="Sales Performance">
                    <BarChart data={salesData} yLabel="₹" />
                </AnalyticsCard>
                <AnalyticsCard title="Website Traffic (Last 7 Days)">
                    <BarChart data={trafficData} />
                </AnalyticsCard>
                <BestSellers products={bestSellers} />
                <LowStockAlerts products={lowStockProducts} />
            </div>

        </div>
    );
};

export default AdminDashboard;
