import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../App';
import { useToast } from '../components/ToastProvider';
import { Address } from '../types';
import WishlistPage from './WishlistPage';
import { mockOrders } from '../data/orders';

const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
  'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Andaman and Nicobar Islands',
  'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Lakshadweep',
  'Delhi', 'Puducherry', 'Jammu and Kashmir', 'Ladakh'
].sort();


// --- SVG Icons for Navigation ---
const icons: { [key: string]: React.ReactNode } = {
  overview: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
  orders: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
  profile: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  addresses: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  wishlist: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>,
  signOut: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>,
};

type View = 'overview' | 'orders' | 'profile' | 'addresses' | 'wishlist';
const navItems: { id: View; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: icons.overview },
    { id: 'orders', label: 'Order History', icon: icons.orders },
    { id: 'wishlist', label: 'My Wishlist', icon: icons.wishlist },
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

const Modal: React.FC<{ children: React.ReactNode, onClose: () => void }> = ({ children, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="relative bg-white rounded-xl shadow-2xl p-8 w-full max-w-md m-4" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors" aria-label="Close">
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        {children}
      </div>
    </div>
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
        : status === 'Delivered' ? { dot: 'bg-green-500', text: 'text-green-700' }
        : { dot: 'bg-yellow-500', text: 'text-yellow-700' };

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

const ProfileSettingsView: React.FC = () => {
    const { user, updateUser, changePassword } = useAuth();
    const { addToast } = useToast();
    
    // State for modals
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
    
    // State for profile editing
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ name: user?.name || '', email: user?.email || '' });
    
    // State for password change
    const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [passwordError, setPasswordError] = useState('');

    // State for OTP
    const [otp, setOtp] = useState('');
    const [otpError, setOtpError] = useState('');
    const MOCK_OTP = '123456';

    React.useEffect(() => {
        if (user) {
            setFormData({ name: user.name, email: user.email });
        }
    }, [user]);

    if (!user) return null;

    // --- Profile Edit Handlers ---
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleEdit = () => {
        setFormData({ name: user.name, email: user.email });
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setFormData({ name: user.name, email: user.email });
    };

    const handleSave = () => {
        if (!formData.name.trim() || !formData.email.trim()) {
            addToast('Name and email cannot be empty.', 'error');
            return;
        }
        
        const isEmailChanged = formData.email.toLowerCase() !== user.email.toLowerCase();

        if (isEmailChanged) {
            addToast(`OTP sent to ${formData.email}: ${MOCK_OTP}`, 'info');
            setIsOtpModalOpen(true);
        } else { // Only name is changed
            updateUser({ name: formData.name });
            addToast('Profile updated successfully!', 'success');
            setIsEditing(false);
        }
    };

    // --- OTP Handlers ---
    const handleOtpSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (otp === MOCK_OTP) {
            updateUser(formData);
            addToast('Profile updated successfully!', 'success');
            setIsOtpModalOpen(false);
            setIsEditing(false);
            setOtp('');
            setOtpError('');
        } else {
            setOtpError('Invalid OTP. Please try again.');
        }
    };
    
    // --- Password Change Handlers ---
    const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
        setPasswordError('');
    };
    
    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const { currentPassword, newPassword, confirmPassword } = passwordData;

        if (!currentPassword || !newPassword || !confirmPassword) {
            setPasswordError('All fields are required.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setPasswordError('New passwords do not match.');
            return;
        }
        
        const success = changePassword(currentPassword, newPassword);
        if (success) {
            addToast('Password changed successfully!', 'success');
            setIsPasswordModalOpen(false);
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } else {
            setPasswordError('Incorrect current password.');
        }
    };

    return (
    <>
        <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm">
            <div className="border-b border-gray-200/80 px-6 py-5 flex justify-between items-center flex-wrap gap-4">
                <div>
                    <h2 className="text-xl font-bold text-black">Profile Settings</h2>
                    <p className="text-sm text-gray-500 mt-1">Manage your account details.</p>
                </div>
                {!isEditing && (
                     <div className="flex gap-4">
                        <button onClick={() => setIsPasswordModalOpen(true)} className="bg-white text-black border border-gray-300 font-semibold py-2 px-5 rounded-lg hover:bg-gray-100 transition-all text-sm shadow-sm">
                            Change Password
                        </button>
                        <button onClick={handleEdit} className="bg-black text-white font-semibold py-2 px-5 rounded-lg hover:bg-gray-800 transition-all text-sm shadow-sm">
                            Edit Profile
                        </button>
                    </div>
                )}
            </div>
            <div className="p-6">
                <div className="space-y-6">
                    <div>
                        <label className="text-sm font-medium text-gray-600 block mb-1.5">Full Name</label>
                        {isEditing ? (
                            <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full rounded-md border border-gray-300 p-3 text-black shadow-sm focus:border-black focus:ring-0 focus:outline-none transition-colors" />
                        ) : (
                            <p className="text-black text-base">{user.name}</p>
                        )}
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-600 block mb-1.5">Email Address</label>
                        {isEditing ? (
                            <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full rounded-md border border-gray-300 p-3 text-black shadow-sm focus:border-black focus:ring-0 focus:outline-none transition-colors" />
                        ) : (
                            <p className="text-black text-base">{user.email}</p>
                        )}
                    </div>
                </div>
                {isEditing && (
                    <div className="mt-8 pt-6 border-t border-gray-200/80 flex justify-end gap-4">
                        <button onClick={handleCancel} className="bg-white text-black border border-gray-300 font-semibold py-2 px-5 rounded-lg hover:bg-gray-100 transition-all text-sm shadow-sm">
                            Cancel
                        </button>
                        <button onClick={handleSave} className="bg-black text-white font-semibold py-2 px-5 rounded-lg hover:bg-gray-800 transition-all text-sm shadow-sm">
                            Save Changes
                        </button>
                    </div>
                )}
            </div>
        </div>
        
        {/* Password Change Modal */}
        {isPasswordModalOpen && (
            <Modal onClose={() => setIsPasswordModalOpen(false)}>
                 <h2 className="text-2xl font-bold text-black mb-2">Change Password</h2>
                 <p className="text-sm text-gray-600 mb-6">Enter your current and new password.</p>
                 <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <input type="password" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordInputChange} placeholder="Current Password" className="w-full rounded-md border border-gray-300 p-3 text-black shadow-sm focus:border-black focus:ring-0 focus:outline-none transition-colors" />
                    <input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordInputChange} placeholder="New Password" className="w-full rounded-md border border-gray-300 p-3 text-black shadow-sm focus:border-black focus:ring-0 focus:outline-none transition-colors" />
                    <input type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordInputChange} placeholder="Confirm New Password" className="w-full rounded-md border border-gray-300 p-3 text-black shadow-sm focus:border-black focus:ring-0 focus:outline-none transition-colors" />
                    {passwordError && <p className="text-sm text-red-600">{passwordError}</p>}
                    <button type="submit" className="w-full bg-black text-white font-semibold py-3 px-5 rounded-lg hover:bg-gray-800 transition-all text-sm shadow-sm">
                        Update Password
                    </button>
                 </form>
            </Modal>
        )}
        
        {/* OTP Verification Modal */}
        {isOtpModalOpen && (
             <Modal onClose={() => setIsOtpModalOpen(false)}>
                 <h2 className="text-2xl font-bold text-black mb-2">Verify Your Email</h2>
                 <p className="text-sm text-gray-600 mb-6">We've sent a 6-digit code to <span className="font-semibold">{formData.email}</span>. Please enter it below.</p>
                 <form onSubmit={handleOtpSubmit} className="space-y-4">
                     <input type="text" value={otp} onChange={(e) => {setOtp(e.target.value); setOtpError('')}} placeholder="Enter OTP" className="w-full rounded-md border border-gray-300 p-3 text-black shadow-sm focus:border-black focus:ring-0 focus:outline-none transition-colors text-center tracking-[0.5em]" maxLength={6}/>
                     {otpError && <p className="text-sm text-red-600">{otpError}</p>}
                     <button type="submit" className="w-full bg-black text-white font-semibold py-3 px-5 rounded-lg hover:bg-gray-800 transition-all text-sm shadow-sm">
                        Verify & Save
                     </button>
                 </form>
             </Modal>
        )}
    </>
    );
};

const AddressBookView: React.FC = () => {
    const { user, addAddress, updateAddress, deleteAddress, setDefaultAddress } = useAuth();
    const { addToast } = useToast();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);

    const openAddModal = () => {
        setEditingAddress(null);
        setIsModalOpen(true);
    };

    const openEditModal = (address: Address) => {
        setEditingAddress(address);
        setIsModalOpen(true);
    };

    const handleDelete = (addressId: string) => {
        if (window.confirm('Are you sure you want to delete this address?')) {
            deleteAddress(addressId);
            addToast('Address deleted.', 'info');
        }
    };

    return (
        <>
            <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm">
                <div className="border-b border-gray-200/80 px-6 py-5 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-black">Address Book</h2>
                        <p className="text-sm text-gray-500 mt-1">Manage your saved shipping addresses.</p>
                    </div>
                    {(!user?.addresses || user.addresses.length === 0) && (
                        <button onClick={openAddModal} className="bg-black text-white font-semibold py-2 px-5 rounded-lg hover:bg-gray-800 transition-all text-sm shadow-sm">
                            Add New Address
                        </button>
                    )}
                </div>
                <div className="p-6">
                    {user?.addresses && user.addresses.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {user.addresses.map(address => (
                                <div key={address.id} className="p-6 bg-gray-50/80 rounded-lg border border-gray-200/80 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start mb-2">
                                            <p className="font-bold text-black">{address.firstName} {address.lastName}</p>
                                            {address.isDefault && <span className="text-xs font-semibold bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full">Default</span>}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            <p>{address.addressLine1}</p>
                                            {address.addressLine2 && <p>{address.addressLine2}</p>}
                                            <p>{address.city}, {address.state} {address.postalCode}</p>
                                            <p>{address.country}</p>
                                            <p className="mt-1">{address.phone}</p>
                                        </div>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-gray-200/80 flex items-center justify-between text-sm font-medium">
                                        <div className="flex gap-4">
                                            <button onClick={() => openEditModal(address)} className="text-black hover:underline">Edit</button>
                                            <button onClick={() => handleDelete(address.id)} className="text-red-600 hover:underline">Delete</button>
                                        </div>
                                        {!address.isDefault && (
                                            <button onClick={() => setDefaultAddress(address.id)} className="text-gray-600 hover:text-black hover:underline">Set as Default</button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <p className="text-gray-500">You have no saved addresses.</p>
                        </div>
                    )}
                </div>
            </div>
            {isModalOpen && (
                <AddressModal
                    address={editingAddress}
                    onClose={() => setIsModalOpen(false)}
                    onSave={(addr) => {
                        if (editingAddress) {
                            updateAddress({ ...addr, id: editingAddress.id });
                            addToast('Address updated successfully!', 'success');
                        } else {
                            addAddress(addr);
                            addToast('Address added successfully!', 'success');
                        }
                        setIsModalOpen(false);
                    }}
                />
            )}
        </>
    );
};

// Address Form Modal
const AddressModal: React.FC<{
    address: Address | null;
    onClose: () => void;
    onSave: (address: Omit<Address, 'id'>) => void;
}> = ({ address, onClose, onSave }) => {
    const [formState, setFormState] = useState({
        firstName: address?.firstName || '',
        lastName: address?.lastName || '',
        addressLine1: address?.addressLine1 || '',
        addressLine2: address?.addressLine2 || '',
        city: address?.city || '',
        state: address?.state || '',
        postalCode: address?.postalCode || '',
        country: address?.country || 'India',
        phone: address?.phone || '',
        isDefault: address?.isDefault || false,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;
        setFormState(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formState);
    };

    const inputClass = "w-full rounded-md border border-gray-300 p-3 text-black shadow-sm focus:border-black focus:ring-0 focus:outline-none transition-colors";

    return (
        <Modal onClose={onClose}>
            <h2 className="text-2xl font-bold text-black mb-4">{address ? 'Edit Address' : 'Add New Address'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                 <div className="grid grid-cols-2 gap-4">
                    <input type="text" name="firstName" value={formState.firstName} onChange={handleChange} placeholder="First Name" required className={inputClass} />
                    <input type="text" name="lastName" value={formState.lastName} onChange={handleChange} placeholder="Last Name" required className={inputClass} />
                 </div>
                <input type="text" name="addressLine1" value={formState.addressLine1} onChange={handleChange} placeholder="Address" required className={inputClass} />
                <input type="text" name="addressLine2" value={formState.addressLine2} onChange={handleChange} placeholder="Apartment, suite, etc. (optional)" className={inputClass} />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <input type="text" name="city" value={formState.city} onChange={handleChange} placeholder="City" required className={inputClass} />
                    <select name="state" value={formState.state} onChange={handleChange} required className={inputClass}>
                        <option value="" disabled>Select State</option>
                        {indianStates.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <input type="text" name="postalCode" value={formState.postalCode} onChange={handleChange} placeholder="PIN Code" required pattern="[0-9]{6}" className={inputClass} />
                </div>
                 <input type="text" name="country" value={formState.country} onChange={handleChange} placeholder="Country" required disabled className={`${inputClass} bg-gray-100`} />
                 <input type="tel" name="phone" value={formState.phone} onChange={handleChange} placeholder="Phone Number" required pattern="\d{10,}" className={inputClass} />
                 
                 <div className="flex items-center">
                    <input type="checkbox" id="isDefault" name="isDefault" checked={formState.isDefault} onChange={handleChange} className="h-4 w-4 text-black border-gray-300 rounded focus:ring-black" />
                    <label htmlFor="isDefault" className="ml-2 block text-sm text-gray-700">Set as default address</label>
                 </div>

                 <div className="pt-4 flex justify-end gap-4">
                     <button type="button" onClick={onClose} className="bg-white text-black border border-gray-300 font-semibold py-2 px-5 rounded-lg hover:bg-gray-100 transition-all text-sm shadow-sm">
                        Cancel
                    </button>
                    <button type="submit" className="bg-black text-white font-semibold py-2 px-5 rounded-lg hover:bg-gray-800 transition-all text-sm shadow-sm">
                        Save Address
                    </button>
                 </div>
            </form>
        </Modal>
    );
};


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
        return <ProfileSettingsView />;
      case 'addresses':
        return <AddressBookView />;
      case 'wishlist':
        return <WishlistPage showTitle={false} />;
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
