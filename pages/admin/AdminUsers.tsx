import React from 'react';
import { useAuth } from '../../App';
import { User } from '../../types';

const RoleBadge: React.FC<{ role: 'admin' | 'customer' }> = ({ role }) => {
    const is_admin = role === 'admin';
    const classes = is_admin
        ? 'bg-blue-100 text-blue-800'
        : 'bg-gray-100 text-gray-800';
    return (
        <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full capitalize ${classes}`}>
            {role}
        </span>
    );
};

const AdminUsers: React.FC = () => {
    const { users, user: currentUser, updateUserRole } = useAuth();
    
    return (
        <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm">
            <div className="border-b border-gray-200/80 px-6 py-5">
                <h2 className="text-xl font-bold text-black">User Management</h2>
                <p className="text-sm text-gray-500 mt-1">View users and manage their roles.</p>
            </div>
            <div className="overflow-x-auto horizontal-scrollbar">
                <table className="min-w-full text-sm text-left">
                    <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                        <tr>
                            <th scope="col" className="px-6 py-3 font-semibold">User</th>
                            <th scope="col" className="px-6 py-3 font-semibold">Email</th>
                            <th scope="col" className="px-6 py-3 font-semibold">Role</th>
                            <th scope="col" className="px-6 py-3 font-semibold text-center">Change Role</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200/80">
                        {users.map(user => (
                            <tr key={user.id}>
                                <td className="px-6 py-4 font-semibold text-black whitespace-nowrap">{user.name}</td>
                                <td className="px-6 py-4 text-gray-700 whitespace-nowrap">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <RoleBadge role={user.role || 'customer'} />
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <select
                                        value={user.role || 'customer'}
                                        onChange={(e) => updateUserRole(user.id, e.target.value as 'admin' | 'customer')}
                                        disabled={user.id === currentUser?.id}
                                        className="rounded-md border-gray-300 text-sm shadow-sm focus:border-black focus:ring-0 focus:outline-none disabled:opacity-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                    >
                                        <option value="customer">Customer</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminUsers;