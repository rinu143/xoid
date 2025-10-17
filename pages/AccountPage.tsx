import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';

const mockOrders = [
  { id: 'Z01D-78923', date: 'July 25, 2024', total: '$275.00', status: 'Shipped', items: ['Void Echo Tee', 'Chrome Fragment Tee'] },
  { id: 'Z01D-54198', date: 'June 12, 2024', total: '$120.00', status: 'Delivered', items: ['Noir Canvas Tee'] },
];

// --- SVG Icons for Navigation ---
const icons: { [key: string]: React.ReactNode } = {
  overview: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
  orders: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
  profile: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  addresses: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  signOut: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>,
};

type View = 'overview' | 'orders' | 'profile' | 'addresses';
const navItems: { id: View; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: icons.overview },
    { id: 'orders', label: 'Order History', icon: icons.orders },
    { id: 'profile', label: 'Profile Settings', icon: icons.profile },
    { id: 'addresses', label: 'Address Book', icon: icons.addresses },
];

// --- Reusable Components for the Page ---

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


// --- Content Views for each Section ---

const OverviewView: React.FC<{ user: { name: string; email: string }, onNavigate: (view: View) => void }> = ({ user, onNavigate }) => {
    const latestOrder = mockOrders[0];
    return (
        <div className="space-y-8">
            <div className="bg-white p-8 rounded-xl border border-gray-200/80 shadow-sm">
                <h2 className="text-2xl font-bold text-black">Welcome back, {user.name.split(' ')[0]}!</h2>
                <p className="mt-2 text-gray-600">
                    From this dashboard, you can view your recent orders, manage your shipping addresses, and edit your account details.
                </p>
            </div>

            {latestOrder && (
                <div className="bg-white p-8 rounded-xl border border-gray-200/80 shadow-sm">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-lg font-bold text-black">Latest Order</h3>
                            <p className="text-sm text-gray-500 mt-1">Order #{latestOrder.id}</p>
                        </div>
                        <button onClick={() => onNavigate('orders')} className="text-sm font-semibold text-black hover:underline">
                            View all orders
                        </button>
                    </div>
                    <div className="mt-6 border-t border-gray-200/80 pt-6">
                        <div className="flex justify-between items-center text-sm">
                            <div>
                                <p className="font-medium text-gray-800">Date</p>
                                <p className="text-gray-600">{latestOrder.date}</p>
                            </div>
                            <div>
                                <p className="font-medium text-gray-800">Total</p>
                                <p className="text-gray-600">{latestOrder.total}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`h-2.5 w-2.5 rounded-full ${latestOrder.status === 'Shipped' ? 'bg-blue-500' : 'bg-green-500'}`}></span>
                                <p className="font-medium text-gray-800">{latestOrder.status}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const statusClasses = status === 'Shipped'
        ? { dot: 'bg-blue-500', text: 'text-blue-700' }
        : { dot: 'bg-green-500', text: 'text-green-700' };

    return (
        <div className="inline-flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${statusClasses.dot}`} />
            <span className={`text-sm font-medium ${statusClasses.text}`}>{status}</span>
        </div>
    );
};

const OrderHistoryView: React.FC = () => (
    <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm">
        <div className="border-b border-gray-200/80 px-6 py-5">
            <h2 className="text-xl font-bold text-black">Order History</h2>
            <p className="text-sm text-gray-500 mt-1">Check the status of recent orders.</p>
        </div>
        {mockOrders.length > 0 ? (
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left">
                    <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                        <tr>
                            <th scope="col" className="px-6 py-3 font-semibold">Order ID</th>
                            <th scope="col" className="px-6 py-3 font-semibold">Date</th>
                            <th scope="col" className="px-6 py-3 font-semibold">Status</th>
                            <th scope="col" className="px-6 py-3 font-semibold text-right">Total</th>
                            <th scope="col" className="px-6 py-3"><span className="sr-only">Actions</span></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200/80">
                        {mockOrders.map(order => (
                            <tr key={order.id}>
                                <td className="px-6 py-4 font-semibold text-black whitespace-nowrap">#{order.id}</td>
                                <td className="px-6 py-4 text-gray-700 whitespace-nowrap">{order.date}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <StatusBadge status={order.status} />
                                </td>
                                <td className="px-6 py-4 text-gray-800 whitespace-nowrap text-right">{order.total}</td>
                                <td className="px-6 py-4 text-right">
                                    <button className="font-semibold text-black hover:underline inline-flex items-center gap-1.5 group">
                                      View Details
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m-5-5h10" /></svg>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        ) : (
             <div className="text-center py-20 px-6 text-gray-500">
                <p>You haven't placed any orders yet.</p>
            </div>
        )}
    </div>
);

const PlaceholderView: React.FC<{title: string}> = ({ title }) => (
    <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm">
        <div className="border-b border-gray-200/80 px-6 py-5">
            <h2 className="text-xl font-bold text-black">{title}</h2>
        </div>
        <div className="text-center py-24 px-6 text-gray-500">
             <p className="font-medium">Coming Soon</p>
             <p className="text-sm mt-1">This feature is currently under development.</p>
        </div>
    </div>
);


// --- Main Account Page Component ---

const AccountPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<View>('overview');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    return null; // ProtectedRoute should prevent this state.
  }

  const renderContent = () => {
    switch (activeView) {
      case 'overview':
        return <OverviewView user={user} onNavigate={setActiveView} />;
      case 'orders':
        return <OrderHistoryView />;
      case 'profile':
        return <PlaceholderView title="Profile Settings" />;
      case 'addresses':
        return <PlaceholderView title="Address Book" />;
      default:
        return <OverviewView user={user} onNavigate={setActiveView} />;
    }
  };

  const getUserInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };
  
  return (
    <div className="max-w-7xl mx-auto">
        <div className="mb-8 md:mb-12">
            <h1 className="text-4xl font-black text-black">My Account</h1>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 lg:gap-x-12 lg:gap-y-8 items-start">
            <aside className="lg:col-span-3 lg:sticky lg:top-28">
                <div className="p-4 bg-white border border-gray-200/80 rounded-xl">
                    {/* User Profile Header */}
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
                         <div className="!mt-4 pt-2">
                            <NavItem
                                label="Sign Out"
                                icon={icons.signOut}
                                isActive={false}
                                onClick={handleLogout}
                            />
                        </div>
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

export default AccountPage;
