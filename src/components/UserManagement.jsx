import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { UserCog, Trash2, Mail, Shield, Search, RefreshCcw, Globe } from "lucide-react";

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await axios.get("http://localhost:5000/api/users");
            setUsers(res.data);
        } catch (err) {
            console.error("Error fetching users", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleUpdateUser = async (id, role, university) => {
        try {
            await axios.put(`http://localhost:5000/api/users/${id}`, { role, university });
            fetchUsers();
        } catch (err) {
            alert("Error updating user");
        }
    };

    const handleDeleteUser = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        try {
            await axios.delete(`http://localhost:5000/api/users/${id}`);
            fetchUsers();
        } catch (err) {
            alert("Error deleting user");
        }
    };

    const filteredUsers = users.filter(user =>
        (user.email || "").toLowerCase().includes(search.toLowerCase()) ||
        (user.loginId || "").toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-4 sm:p-8 h-full flex flex-col overflow-hidden">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 sm:mb-8 shrink-0">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
                        <UserCog className="text-red-500 animate-pulse" size={32} />
                        Admin Panel
                    </h2>
                    <p className="text-gray-500 mt-1 text-xs sm:text-sm">Grant admin or PM/PMA access to registered users.</p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="flex items-center gap-3 bg-gray-800/40 px-4 py-2 rounded-xl flex-1 md:w-80 border border-gray-800/80">
                        <Search size={18} className="text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search email or login ID..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-transparent border-none outline-none text-sm w-full text-white placeholder-gray-600"
                        />
                    </div>
                    <button
                        onClick={fetchUsers}
                        className="p-2.5 rounded-xl bg-gray-800/40 hover:bg-gray-700/40 transition-colors text-gray-400 hover:text-white border border-gray-800"
                    >
                        <RefreshCcw size={20} className={loading ? "animate-spin" : ""} />
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 sm:mb-8 shrink-0">
                <div className="bg-[#1c2128]/50 border border-gray-800 p-4 rounded-2xl flex items-center justify-between backdrop-blur-md">
                    <div>
                        <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">Total Users</p>
                        <p className="text-xl sm:text-2xl font-black text-white">{users.length}</p>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
                        <UserCog size={16} />
                    </div>
                </div>

                <div className="bg-[#1c2128]/50 border border-gray-800 p-4 rounded-2xl flex items-center justify-between backdrop-blur-md">
                    <div>
                        <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">VGU Users</p>
                        <p className="text-xl sm:text-2xl font-black text-white">
                            {users.filter(u => u.role === "manager" && u.university?.toLowerCase() === "vgu").length}
                        </p>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
                        <Globe size={16} />
                    </div>
                </div>

                <div className="bg-[#1c2128]/50 border border-gray-800 p-4 rounded-2xl flex items-center justify-between backdrop-blur-md">
                    <div>
                        <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">SGU Users</p>
                        <p className="text-xl sm:text-2xl font-black text-white">
                            {users.filter(u => u.role === "manager" && u.university?.toLowerCase() === "sgu").length}
                        </p>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-500">
                        <Globe size={16} />
                    </div>
                </div>

                <div className="bg-[#1c2128]/50 border border-gray-800 p-4 rounded-2xl flex items-center justify-between backdrop-blur-md">
                    <div>
                        <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">ADYPU Users</p>
                        <p className="text-xl sm:text-2xl font-black text-white">
                            {users.filter(u => u.role === "manager" && u.university?.toLowerCase() === "adypu").length}
                        </p>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-500">
                        <Globe size={16} />
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex-1 flex items-center justify-center text-gray-500 font-bold text-sm">
                    Fetching secure records...
                </div>
            ) : filteredUsers.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-gray-500 font-bold text-sm">
                    No system users found matching search criteria.
                </div>
            ) : (
                <>
                    {/* Tablet/Desktop Table View (Hidden on mobile) */}
                    <div className="hidden md:block flex-1 overflow-y-auto bg-[#161b22]/30 border border-gray-800 rounded-[2rem] shadow-2xl overflow-hidden custom-scrollbar">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-[#1c2128]">
                                    <th className="p-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-800">User Details</th>
                                    <th className="p-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-800">Assigned Access</th>
                                    <th className="p-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-800">Organization / University</th>
                                    <th className="p-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-800 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {filteredUsers.map(user => (
                                    <tr key={user.id} className="hover:bg-white/[0.01] transition-colors">
                                        <td className="p-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 flex items-center justify-center text-red-500 font-bold text-lg">
                                                    {(user.loginId || "User")[0].toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="text-white font-semibold text-base">{user.loginId || "User"}</p>
                                                    <div className="flex items-center gap-1.5 text-gray-500 text-xs mt-0.5">
                                                        <Mail size={12} />
                                                        <span>{user.email}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <select
                                                value={user.role}
                                                onChange={(e) => handleUpdateUser(user.id, e.target.value, user.university)}
                                                className={`px-4 py-2.5 rounded-xl border text-sm font-bold transition-all outline-none cursor-pointer ${user.role === 'central'
                                                        ? 'bg-[#1c2128] text-amber-500 border-amber-500/30'
                                                        : 'bg-[#1c2128] text-blue-500 border-blue-500/30'
                                                    }`}
                                            >
                                                <option value="manager" className="bg-[#161b22] text-white">PM/PMA</option>
                                                <option value="central" className="bg-[#161b22] text-white">Admin</option>
                                            </select>
                                        </td>
                                        <td className="p-6">
                                            {user.role === 'central' ? (
                                                <div className="flex items-center gap-2 text-amber-500 font-medium bg-amber-500/5 w-fit px-4 py-2.5 rounded-xl border border-amber-500/10 italic text-sm">
                                                    <Shield size={16} /> All Universities
                                                </div>
                                            ) : (
                                                <select
                                                    value={user.university}
                                                    onChange={(e) => handleUpdateUser(user.id, user.role, e.target.value)}
                                                    className="w-full max-w-xs bg-gray-800/40 border border-gray-700 rounded-xl p-2.5 text-white text-sm outline-none focus:border-red-600 transition-colors cursor-pointer"
                                                >
                                                    <option value="All Universities">All Universities</option>
                                                    <option value="VGU">VGU</option>
                                                    <option value="sgu">sgu</option>
                                                    <option value="adypu">adypu</option>
                                                </select>
                                            )}
                                        </td>
                                        <td className="p-6">
                                            <div className="flex justify-center">
                                                <button
                                                    onClick={() => handleDeleteUser(user.id)}
                                                    className="p-3 rounded-xl hover:bg-red-500/10 text-gray-500 hover:text-red-500 transition-all border border-transparent hover:border-red-500/20 bg-transparent border-none"
                                                    title="Revoke Access"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card List View (Visible on small viewports) */}
                    <div className="block md:hidden flex-1 space-y-4 overflow-y-auto custom-scrollbar">
                        {filteredUsers.map(user => (
                            <div key={user.id} className="bg-[#161b22]/30 border border-gray-800 rounded-3xl p-5 flex flex-col gap-4 relative">
                                {/* User Details Header */}
                                <div className="flex items-center gap-4 border-b border-gray-800/60 pb-3 pr-8">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 flex items-center justify-center text-red-500 font-bold text-lg shrink-0">
                                        {(user.loginId || "User")[0].toUpperCase()}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-white font-semibold truncate">{user.loginId || "User"}</p>
                                        <p className="text-xs text-gray-500 truncate flex items-center gap-1.5 mt-0.5">
                                            <Mail size={12} className="shrink-0" /> 
                                            <span className="truncate">{user.email}</span>
                                        </p>
                                    </div>
                                    <button 
                                        onClick={() => handleDeleteUser(user.id)}
                                        className="absolute top-5 right-5 text-gray-600 hover:text-red-500 p-2 rounded-lg hover:bg-red-500/10 transition-colors bg-transparent border-none"
                                        title="Revoke Access"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>

                                {/* Controls */}
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Access Role</label>
                                        <select
                                            value={user.role}
                                            onChange={(e) => handleUpdateUser(user.id, e.target.value, user.university)}
                                            className={`w-full px-4 py-2.5 rounded-xl border text-sm font-bold transition-all outline-none cursor-pointer ${
                                                user.role === 'central'
                                                    ? 'bg-[#1c2128] text-amber-500 border-amber-500/30'
                                                    : 'bg-[#1c2128] text-blue-500 border-blue-500/30'
                                            }`}
                                        >
                                            <option value="manager">PM/PMA</option>
                                            <option value="central">Admin</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Organization</label>
                                        {user.role === 'central' ? (
                                            <div className="flex items-center gap-2 text-amber-500 font-medium bg-[#1c2128] w-full px-4 py-2.5 rounded-xl border border-amber-500/10 italic text-sm">
                                                <Shield size={16} /> All Universities
                                            </div>
                                        ) : (
                                            <select
                                                value={user.university}
                                                onChange={(e) => handleUpdateUser(user.id, user.role, e.target.value)}
                                                className="w-full bg-[#1c2128] border border-gray-700 rounded-xl p-2.5 text-white text-sm outline-none focus:border-red-600 transition-colors cursor-pointer"
                                            >
                                                <option value="All Universities">All Universities</option>
                                                <option value="VGU">VGU</option>
                                                <option value="sgu">sgu</option>
                                                <option value="adypu">adypu</option>
                                            </select>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #444; }
            `}</style>
        </div>
    );
}
