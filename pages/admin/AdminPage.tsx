import React, { useState } from 'react';
import { useAuth } from '../../App';
import AdminDashboard from './AdminDashboard';
import AdminProducts from './AdminProducts';
import AdminOrders from './AdminOrders';
import AdminUsers from './AdminUsers';

const icons: { [key: string]: React.ReactNode } = {
  dashboard: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
  products: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>,
  orders: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
  users: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21a6 6 0 00-9-5.197m0 0A5.995 5.995 0 0012 12a5.995 5.995 0 00-3-5.197M15 21a6 6 0 00-9-5.197" /></svg>,
};

type AdminView = 'dashboard' | 'products' | 'orders' | 'users';
const navItems: { id: AdminView; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: icons.dashboard },
    { id: 'products', label: 'Products', icon: icons.products },
    { id: 'orders', label: 'Orders', icon: icons.orders },
    { id: 'users', label: 'Users', icon: icons.users },
];

const NavItem: React.FC<{
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3.5 px-4 py-3 text-sm rounded-lg transition-colors duration-200 ${
            isActive
                ? 'bg-black text-white font-semibold shadow-sm'
                : 'text-gray-600 hover:bg-gray-100 hover:text-black'
        }`}
    >
        {icon}
        <span>{label}</span>
    </button>
);


const AdminPage: React.FC = () => {
    const { user } = useAuth();
    const [activeView, setActiveView] = useState<AdminView>('dashboard');

    if (!user) return null;

    const renderContent = () => {
        switch (activeView) {
            case 'dashboard': return <AdminDashboard />;
            case 'products': return <AdminProducts />;
            case 'orders': return <AdminOrders />;
            case 'users': return <AdminUsers />;
            default: return <AdminDashboard />;
        }
    };

    const getUserInitials = (name: string) => {
        return name.substring(0, 2).toUpperCase();
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="mb-8 md:mb-12">
                <h1 className="text-4xl font-black text-black">Admin Panel</h1>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-12 lg:gap-y-8 items-start">
                <div className="lg:hidden p-4 bg-white border border-gray-200/80 rounded-xl mb-8">
                     {/* Mobile Admin Profile Header */}
                    <div className="flex items-center gap-4 border-b border-gray-200/80 pb-4 mb-4">
                        <div className="h-12 w-12 rounded-full bg-black text-white flex items-center justify-center font-bold text-lg flex-shrink-0">
                            {getUserInitials(user.name)}
                        </div>
                        <div>
                            <p className="font-bold text-black truncate">{user.name}</p>
                            <p className="text-sm text-gray-500 truncate">{user.email}</p>
                        </div>
                    </div>
                    {/* Mobile Navigation */}
                    <div className="relative">
                        <select
                            value={activeView}
                            onChange={(e) => setActiveView(e.target.value as AdminView)}
                            className="w-full appearance-none rounded-md border border-gray-300 bg-white py-3 pl-4 pr-10 text-base font-medium text-black transition-colors duration-200 hover:border-gray-400 focus:border-black focus:outline-none focus:ring-0"
                        >
                            {navItems.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}
                        </select>
                         <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-gray-500">
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                        </div>
                    </div>
                </div>

                <aside className="hidden lg:block lg:col-span-3 lg:sticky lg:top-28">
                    <div className="p-4 bg-white border border-gray-200/80 rounded-xl">
                        {/* Admin Profile Header */}
                        <div className="flex items-center gap-4 border-b border-gray-200/80 pb-4 mb-4">
                            <div className="h-12 w-12 rounded-full bg-black text-white flex items-center justify-center font-bold text-lg">
                                {getUserInitials(user.name)}
                            </div>
                            <div>
                                <p className="font-bold text-black truncate">{user.name}</p>
                                <p className="text-sm text-gray-500 truncate">{user.email}</p>
                            </div>
                        </div>
                        {/* Navigation */}
                        <nav className="space-y-1">
                            {navItems.map(item => (
                               <NavItem
                                    key={item.id}
                                    label={item.label}
                                    icon={item.icon}
                                    isActive={activeView === item.id}
                                    onClick={() => setActiveView(item.id)}
                                />
                            ))}
                        </nav>
                    </div>
                </aside>

                <main className="lg:col-span-9">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default AdminPage;