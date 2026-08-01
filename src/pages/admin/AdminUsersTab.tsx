import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Users, Trash2, Mail, Phone, MapPin, Shield, CheckCircle2 } from 'lucide-react';

export const AdminUsersTab: React.FC = () => {
  const { users, deleteUser, currentUser } = useStore();
  const [successMsg, setSuccessMsg] = useState('');

  const handleDelete = (id: string, name: string, role: string) => {
    if (role === 'admin') {
      alert('Cannot delete executive admin accounts.');
      return;
    }
    if (window.confirm(`Are you sure you want to delete customer account "${name}"?`)) {
      deleteUser(id);
      setSuccessMsg(`Deleted user "${name}" successfully.`);
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="pb-6 border-b border-neutral-200">
        <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-neutral-900 flex items-center gap-2.5">
          <Users className="w-7 h-7 text-neutral-800" />
          <span>User & Customer Account Directory</span>
        </h1>
        <p className="text-xs text-neutral-500 mt-1">
          Review registered customer profiles, default shipping addresses, and contact phone numbers per Section 12.
        </p>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-2xl flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-3xl border border-neutral-200 shadow-xs overflow-hidden">
        <div className="p-6 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between">
          <h3 className="font-serif font-bold text-base text-neutral-900">Registered Accounts ({users.length})</h3>
          <span className="text-xs font-mono font-semibold bg-neutral-200 px-3 py-1 rounded-full text-neutral-800">
            Database Synced
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-100/80 text-neutral-600 text-[11px] font-bold uppercase tracking-wider border-b border-neutral-200">
                <th className="py-3.5 px-6">User Name & Role</th>
                <th className="py-3.5 px-6">Email Address</th>
                <th className="py-3.5 px-6">Phone (Courier)</th>
                <th className="py-3.5 px-6">Default Shipping Address</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-xs font-medium">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-sm">
                        {u.profilePicture ? (
                          <img src={u.profilePicture} alt="Pic" className="w-full h-full object-cover rounded-full" />
                        ) : (
                          u.name.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div>
                        <p className="font-serif font-bold text-sm text-neutral-900 flex items-center gap-1.5">
                          <span>{u.name}</span>
                          {u.role === 'admin' && (
                            <span className="px-2 py-0.2 bg-emerald-100 text-emerald-800 text-[9px] font-bold uppercase rounded">
                              Admin
                            </span>
                          )}
                        </p>
                        <p className="text-[10px] text-neutral-400 font-mono">ID: {u.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-mono text-neutral-800">
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                      <span>{u.email}</span>
                    </span>
                  </td>
                  <td className="py-4 px-6 font-mono text-neutral-800">
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                      <span>{u.phone || 'N/A'}</span>
                    </span>
                  </td>
                  <td className="py-4 px-6 text-neutral-600 max-w-xs truncate">
                    <span className="flex items-center gap-1.5" title={u.shippingAddress}>
                      <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                      <span className="truncate">{u.shippingAddress || 'No address set'}</span>
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    {u.role !== 'admin' && (
                      <button
                        onClick={() => handleDelete(u.id, u.name, u.role)}
                        className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors"
                        title="Delete User Account"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
