import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { Plus, CheckCircle2, Clock, Trash2, X, Users, AlertCircle, LayoutList } from "lucide-react";
import { API_URL } from "../config";
import { CustomSelect } from "./CustomSelect";

export default function TaskBoard() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Auth info
    const [user, setUser] = useState(null);
    const [isCentral, setIsCentral] = useState(false);

    // Form states
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [assignedTeam, setAssignedTeam] = useState("Operations Team");
    const [priority, setPriority] = useState("Medium");

    const teams = ["Designer", "Facility Team", "Operations Team", "Other"];
    const priorities = ["Low", "Medium", "High"];

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            setUser(parsed);
            setIsCentral(parsed.role === "central");
        }
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/tasks`);
            setTasks(res.data);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        } finally {
            setLoading(false);
        }
    };

    // Derived tasks filtered by user role
    const filteredTasks = tasks.filter(t => {
        if (isCentral) return true;
        // If not central, only show tasks created by their university
        return t.university === user?.university;
    });

    const columns = [
        { id: "Pending", title: "Pending", icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" },
        { id: "In Progress", title: "In Progress", icon: AlertCircle, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
        { id: "Completed", title: "Completed", icon: CheckCircle2, color: "text-green-500", bg: "bg-green-500/10", border: "border-green-500/20" }
    ];

    const getPriorityColor = (p) => {
        if (p === "High") return "text-red-500 bg-red-500/10 border-red-500/20";
        if (p === "Medium") return "text-amber-500 bg-amber-500/10 border-amber-500/20";
        return "text-green-500 bg-green-500/10 border-green-500/20";
    };

    const handleCreateTask = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        try {
            const res = await axios.post(`${API_URL}/api/tasks`, {
                title,
                description,
                status: "Pending",
                priority,
                assigned_team: assignedTeam,
                university: isCentral ? "All Universities" : user?.university,
                created_by: user?.id
            });
            setTasks([res.data, ...tasks]);
            setIsModalOpen(false);
            setTitle("");
            setDescription("");
        } catch (error) {
            console.error("Error creating task:", error);
            alert("Failed to create task");
        }
    };

    const handleUpdateStatus = async (id, newStatus) => {
        try {
            const res = await axios.put(`${API_URL}/api/tasks/${id}`, { status: newStatus });
            setTasks(tasks.map(t => t.id === id ? res.data : t));
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this task?")) return;
        try {
            await axios.delete(`${API_URL}/api/tasks/${id}`);
            setTasks(tasks.filter(t => t.id !== id));
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    return (
        <div className="flex flex-col h-full bg-transparent text-white overflow-hidden w-full">
            <div className="flex items-center justify-between p-4 sm:p-8 shrink-0">
                <div>
                    <h2 className="text-xl sm:text-3xl font-black mb-2 flex items-center gap-2">
                        <LayoutList className="text-red-500" size={32} />
                        Task Board
                    </h2>
                    <p className="text-sm text-gray-500">Raise and track tasks across different teams</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 transition-all px-4 sm:px-6 py-2.5 rounded-xl font-medium shadow-lg shadow-red-600/20 text-xs sm:text-sm border-none cursor-pointer"
                >
                    <Plus size={18} />
                    <span>Raise Task</span>
                </button>
            </div>

            {loading ? (
                <div className="flex-1 flex items-center justify-center">
                    <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="flex-1 overflow-x-auto custom-scrollbar px-4 sm:px-8 pb-8">
                    <div className="flex gap-6 min-w-max h-full">
                        {columns.map(col => (
                            <div key={col.id} className="w-80 flex flex-col h-full bg-[#161b22] rounded-2xl border border-gray-800 p-4 shrink-0">
                                <div className="flex items-center justify-between mb-4 shrink-0">
                                    <div className="flex items-center gap-2">
                                        <div className={`p-1.5 rounded-lg border ${col.bg} ${col.border} ${col.color}`}>
                                            <col.icon size={16} />
                                        </div>
                                        <h3 className="font-bold text-gray-200">{col.title}</h3>
                                    </div>
                                    <span className="text-xs font-bold text-gray-500 bg-[#1c2128] px-2 py-1 rounded-full">
                                        {filteredTasks.filter(t => t.status === col.id).length}
                                    </span>
                                </div>

                                <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-1 relative min-h-0">
                                    <AnimatePresence>
                                        {filteredTasks.filter(t => t.status === col.id).map(task => (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                key={task.id}
                                                className="bg-[#1c2128] p-4 rounded-xl border border-gray-800 hover:border-gray-700 transition-colors group relative"
                                            >
                                                {(isCentral || task.university === user?.university) && (
                                                    <button onClick={() => handleDelete(task.id)} className="absolute top-3 right-3 text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all bg-transparent border-none cursor-pointer">
                                                        <Trash2 size={14} />
                                                    </button>
                                                )}
                                                <div className="mb-2 pr-6">
                                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border inline-block mb-2 ${getPriorityColor(task.priority)}`}>
                                                        {task.priority}
                                                    </span>
                                                    <h4 className="font-bold text-sm text-gray-100 leading-tight">{task.title}</h4>
                                                    {task.description && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{task.description}</p>}
                                                </div>
                                                
                                                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-800/50">
                                                    <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-800/30 px-2 py-1 rounded-lg">
                                                        <Users size={12} />
                                                        <span>{task.assigned_team}</span>
                                                    </div>
                                                </div>

                                                <div className="mt-3 flex items-center justify-between gap-2">
                                                    <span className="text-[10px] text-gray-600 font-medium truncate w-24" title={task.university}>
                                                        {task.university}
                                                    </span>
                                                    
                                                    <select
                                                        value={task.status}
                                                        onChange={(e) => handleUpdateStatus(task.id, e.target.value)}
                                                        className="bg-[#161b22] border border-gray-700 text-gray-300 text-[10px] font-bold uppercase rounded-lg px-2 py-1 outline-none focus:border-red-500 transition-colors cursor-pointer"
                                                    >
                                                        <option value="Pending">Pending</option>
                                                        <option value="In Progress">In Progress</option>
                                                        <option value="Completed">Completed</option>
                                                    </select>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.9, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.9, y: 20, opacity: 0 }} className="relative z-10 bg-[#161b22] border border-gray-800 w-full max-w-lg rounded-[2.5rem] p-6 sm:p-10 shadow-2xl">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl sm:text-3xl font-bold text-white">Raise Task</h3>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 bg-[#1c2128] hover:bg-red-500/20 text-gray-400 hover:text-red-500 rounded-full transition-colors border-none cursor-pointer"><X size={20} /></button>
                            </div>
                            
                            <form onSubmit={handleCreateTask} className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 uppercase mb-2 block tracking-widest">Task Title</label>
                                    <input required autoFocus placeholder="What needs to be done?" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-[#1c2128] border border-gray-800 rounded-2xl p-4 text-white outline-none focus:border-red-600 text-sm sm:text-base" />
                                </div>
                                
                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 uppercase mb-2 block tracking-widest">Description</label>
                                    <textarea rows={3} placeholder="Provide details about the task..." value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-[#1c2128] border border-gray-800 rounded-2xl p-4 text-white outline-none focus:border-red-600 text-sm sm:text-base resize-none custom-scrollbar" />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-500 uppercase mb-2 block tracking-widest">Assign Team</label>
                                        <CustomSelect value={assignedTeam} onChange={setAssignedTeam} options={teams} />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-500 uppercase mb-2 block tracking-widest">Priority</label>
                                        <CustomSelect value={priority} onChange={setPriority} options={priorities} />
                                    </div>
                                </div>

                                <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-red-600/20 flex items-center justify-center gap-2 mt-4 border-none cursor-pointer">
                                    <Plus size={20} />
                                    Create Task
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
