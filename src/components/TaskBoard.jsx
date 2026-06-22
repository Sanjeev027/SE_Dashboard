import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { Plus, CheckCircle2, Clock, Trash2, X, Users, AlertCircle, LayoutList, Calendar } from "lucide-react";
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

    // SOP Upload states
    const [sopFile, setSopFile] = useState(null);
    const [sopUrl, setSopUrl] = useState("");
    const [isUploadingSop, setIsUploadingSop] = useState(false);
    const [extractedTasks, setExtractedTasks] = useState(null);
    
    const [activeTab, setActiveTab] = useState("board");
    
    // Team structure states
    const [taskScope, setTaskScope] = useState("University");
    const [selectedUniversities, setSelectedUniversities] = useState([]);

    const teams = ["Operations Team", "Design Team", "Facility Team", "Others"];
    const priorities = ["Low", "Medium", "High"];

    // Filters
    const [filterCampus, setFilterCampus] = useState("All");
    const [filterSource, setFilterSource] = useState("All");

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            setUser(parsed);
            setIsCentral(parsed.role === "central_admin");
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
        let pass = true;
        if (!isCentral && t.university !== user?.university) pass = false;
        
        if (filterCampus !== "All" && t.university !== filterCampus) pass = false;
        if (filterSource !== "All" && t.task_source !== filterSource) pass = false;
        
        return pass;
    });

    const pendingApprovalTasks = tasks.filter(t => {
        if (t.status !== "Pending Approval") return false;
        if (!isCentral && t.university !== user?.university && t.university !== "All Universities") return false;
        return true;
    });

    const columns = [
        { id: "Pending", title: "Pending", icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" },
        { id: "Assigned", title: "Assigned", icon: Users, color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/20" },
        { id: "In Progress", title: "In Progress", icon: AlertCircle, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
        { id: "Completed", title: "Completed", icon: CheckCircle2, color: "text-green-500", bg: "bg-green-500/10", border: "border-green-500/20" },
        { id: "Missed", title: "Missed", icon: X, color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20" },
        { id: "Rejected", title: "Rejected", icon: Trash2, color: "text-red-800", bg: "bg-red-800/10", border: "border-red-800/20" }
    ];

    const getPriorityColor = (p) => {
        if (p === "High") return "text-red-500 bg-red-500/10 border-red-500/20";
        if (p === "Medium") return "text-amber-500 bg-amber-500/10 border-amber-500/20";
        return "text-green-500 bg-green-500/10 border-green-500/20";
    };

    const resetModal = () => {
        setIsModalOpen(false);
        setTitle("");
        setDescription("");
        setSopFile(null);
        setSopUrl("");
        setExtractedTasks(null);
    };

    const handleSopUpload = async () => {
        if (!sopFile && !sopUrl) return;
        setIsUploadingSop(true);
        const formData = new FormData();
        if (sopFile) {
            formData.append("sopDocument", sopFile);
        } else {
            formData.append("sopUrl", sopUrl);
        }

        try {
            const res = await axios.post(`${API_URL}/api/upload/sop`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setExtractedTasks(res.data.extractedTasks);
        } catch (error) {
            console.error("Error uploading SOP:", error);
            alert("Failed to process SOP Document");
        } finally {
            setIsUploadingSop(false);
        }
    };

    const handleBatchSubmit = async () => {
        if (!extractedTasks || extractedTasks.length === 0) return;
        
        try {
            let targets = [];
            if (assignedTeam !== "Operations Team" || taskScope === "Central Team") {
                targets = ["Central"];
            } else {
                targets = selectedUniversities;
                if (targets.length === 0) {
                    alert("Please select at least one university");
                    return;
                }
            }

            const batchId = crypto.randomUUID();
            const tasksToSubmit = [];
            
            targets.forEach(uni => {
                extractedTasks.forEach(t => {
                    tasksToSubmit.push({
                        title: t.task_name,
                        description: t.task_description,
                        status: "Pending Approval",
                        priority,
                        assigned_team: assignedTeam,
                        university: uni,
                        created_by: user?.id,
                        batch_id: batchId,
                        task_source: "sop"
                    });
                });
            });

            const res = await axios.post(`${API_URL}/api/tasks/batch`, { tasks: tasksToSubmit });
            setTasks([...res.data.tasks, ...tasks]);
            resetModal();
            alert("Tasks submitted for approval successfully!");
        } catch (error) {
            console.error("Error submitting task batch:", error);
            alert("Failed to submit tasks for approval");
        }
    };

    const handleCreateTask = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        try {
            // Determine universities to assign
            let targets = [];
            if (assignedTeam !== "Operations Team" || taskScope === "Central Team") {
                targets = ["Central"];
            } else {
                targets = selectedUniversities;
                if (targets.length === 0) {
                    alert("Please select at least one university");
                    return;
                }
            }

            const tasksToCreate = targets.map(uni => ({
                title,
                description,
                status: "Pending",
                priority,
                assigned_team: assignedTeam,
                university: uni,
                created_by: user?.id,
                task_source: "manual"
            }));

            // Use batch endpoint to insert multiple
            const res = await axios.post(`${API_URL}/api/tasks/batch`, { tasks: tasksToCreate });
            setTasks([...res.data.tasks, ...tasks]);
            resetModal();
            setSelectedUniversities([]);
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
            <div className="flex items-center justify-between p-4 sm:p-8 shrink-0 pb-4">
                <div>
                    <h2 className="text-xl sm:text-3xl font-black mb-2 flex items-center gap-2">
                        <LayoutList className="text-red-500" size={32} />
                        Task Board
                    </h2>
                    <p className="text-sm text-muted">Raise and track tasks across different teams</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-primary hover:bg-primary-hover transition-all px-4 sm:px-6 py-2.5 rounded-xl font-medium shadow-lg shadow-primary/20 text-xs sm:text-sm border-none cursor-pointer"
                >
                    <Plus size={18} />
                    <span>Raise Task</span>
                </button>
            </div>
            
            <div className="px-4 sm:px-8 border-b border-border-card mb-6 flex gap-6 shrink-0">
                <button 
                    onClick={() => setActiveTab("board")} 
                    className={`pb-4 border-b-2 font-bold transition-all text-sm sm:text-base bg-transparent cursor-pointer ${activeTab === 'board' ? 'border-red-500 text-white' : 'border-transparent text-muted hover:text-gray-300'}`}
                >
                    Task Board
                </button>
                <button 
                    onClick={() => setActiveTab("approvals")} 
                    className={`pb-4 border-b-2 font-bold transition-all text-sm sm:text-base flex items-center gap-2 bg-transparent cursor-pointer ${activeTab === 'approvals' ? 'border-blue-500 text-white' : 'border-transparent text-muted hover:text-gray-300'}`}
                >
                    Pending Approvals
                    {pendingApprovalTasks.length > 0 && (
                        <span className="bg-blue-500 text-white text-[10px] px-2 py-0.5 rounded-full">{pendingApprovalTasks.length}</span>
                    )}
                </button>
            </div>

            {activeTab === 'board' ? (
                <>
                    {/* Stats Counter Grid */}
                    <div className="px-4 sm:px-8 shrink-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 sm:mb-8">
                    <div className="bg-app border border-border-card p-5 rounded-2xl flex items-center justify-between backdrop-blur-md transition-all hover:border-red-500/30">
                        <div>
                            <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1">Total Tasks</p>
                            <p className="text-2xl font-black text-white">{filteredTasks.length}</p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
                            <LayoutList size={20} />
                        </div>
                    </div>

                    <div className="bg-app border border-border-card p-5 rounded-2xl flex items-center justify-between backdrop-blur-md transition-all hover:border-green-500/30">
                        <div>
                            <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1">Completed Tasks</p>
                            <p className="text-2xl font-black text-white">{filteredTasks.filter(t => t.status === "Completed").length}</p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-500">
                            <CheckCircle2 size={20} />
                        </div>
                    </div>

                    <div className="bg-app border border-border-card p-5 rounded-2xl flex items-center justify-between backdrop-blur-md transition-all hover:border-amber-500/30">
                        <div>
                            <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1">Pending Tasks</p>
                            <p className="text-2xl font-black text-white">{filteredTasks.filter(t => t.status === "Pending").length}</p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                            <Clock size={20} />
                        </div>
                    </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 mb-6">
                    {isCentral && (
                        <div className="w-48">
                            <CustomSelect 
                                value={filterCampus} 
                                onChange={setFilterCampus} 
                                options={["All", "VGU", "SGU", "ADYPU"]} 
                                placeholder="Filter Campus"
                                padding="py-2.5 px-4"
                                textSize="text-xs sm:text-sm font-semibold"
                            />
                        </div>
                    )}
                    <div className="w-48">
                        <CustomSelect 
                            value={filterSource} 
                            onChange={setFilterSource} 
                            options={["All", "manual", "sop"]} 
                            placeholder="Task Source"
                            padding="py-2.5 px-4"
                            textSize="text-xs sm:text-sm font-semibold"
                        />
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex-1 flex items-center justify-center">
                    <div className="w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="flex-1 overflow-x-auto custom-scrollbar px-4 sm:px-8 pb-8">
                    <div className="flex gap-6 min-w-max h-full">
                        {columns.map(col => (
                            <div key={col.id} className="w-80 flex flex-col h-full bg-sidebar rounded-[20px] border border-border-card p-4 shrink-0">
                                <div className="flex items-center justify-between mb-4 shrink-0">
                                    <div className="flex items-center gap-2">
                                        <div className={`p-1.5 rounded-lg border ${col.bg} ${col.border} ${col.color}`}>
                                            <col.icon size={16} />
                                        </div>
                                        <h3 className="font-bold text-gray-200">{col.title}</h3>
                                    </div>
                                    <span className="text-xs font-bold text-muted bg-card px-2 py-1 rounded-full">
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
                                                className="bg-card p-4 rounded-[18px] shadow-sm hover:shadow-md hover:-translate-y-1 border border-border-card hover:border-hover transition-all duration-300 group relative"
                                            >
                                                {(isCentral || task.university === user?.university) && (
                                                    <button onClick={() => handleDelete(task.id)} className="absolute top-3 right-3 text-gray-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all bg-transparent border-none cursor-pointer">
                                                        <Trash2 size={14} />
                                                    </button>
                                                )}
                                                <div className="mb-2 pr-6">
                                                    <div className="flex flex-wrap items-center gap-1.5 mb-2">
                                                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border inline-block ${getPriorityColor(task.priority)}`}>
                                                            {task.priority}
                                                        </span>
                                                        {task.task_source === 'sop' && (
                                                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-blue-500/20 text-blue-500 bg-blue-500/10 flex items-center gap-1">
                                                                <LayoutList size={10} /> SOP
                                                            </span>
                                                        )}
                                                    </div>
                                                    <h4 className="font-bold text-sm text-gray-100 leading-tight">{task.title}</h4>
                                                    {task.description && <p className="text-xs text-muted mt-1 line-clamp-2">{task.description}</p>}
                                                </div>
                                                
                                                <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-4 border-t border-border-card/50">
                                                    <div className="flex items-center gap-1.5 text-xs text-muted bg-gray-800/30 px-2 py-1 rounded-lg shrink-0">
                                                        <Users size={12} />
                                                        <span className="truncate max-w-[80px] sm:max-w-[100px]">{task.assigned_team}</span>
                                                    </div>
                                                    {task.due_date && (
                                                        <div className={`flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-lg shrink-0 ${new Date(task.due_date) < new Date() && task.status !== 'Completed' ? 'text-red-500 bg-red-500/10' : 'text-muted bg-gray-800/50'}`}>
                                                            <Calendar size={10} />
                                                            {new Date(task.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="mt-3 flex items-center justify-between gap-2">
                                                    <span className="text-[10px] text-gray-600 font-medium truncate w-24" title={task.university}>
                                                        {task.university}
                                                    </span>
                                                    
                                                    <select
                                                        value={task.status}
                                                        onChange={(e) => handleUpdateStatus(task.id, e.target.value)}
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="bg-app border border-hover text-muted text-[10px] font-bold uppercase rounded-lg px-2 py-1 outline-none focus:border-primary transition-colors cursor-pointer"
                                                    >
                                                        <option value="Pending">Pending</option>
                                                        <option value="In Progress">In Progress</option>
                                                        <option value="Completed">Completed</option>
                                                        <option value="Missed">Missed</option>
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
                        <motion.div initial={{ scale: 0.9, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.9, y: 20, opacity: 0 }} className="relative z-10 bg-card border border-border-card w-full max-w-lg rounded-[2.5rem] p-6 sm:p-10 shadow-2xl">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-2xl sm:text-3xl font-bold text-white">Raise Task</h3>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 bg-card hover:bg-red-500/20 text-muted hover:text-red-500 rounded-full transition-colors border-none cursor-pointer"><X size={20} /></button>
                            </div>
                            
                            {extractedTasks ? (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                                            <LayoutList size={18} className="text-blue-500" />
                                            Review Extracted Tasks
                                        </h4>
                                        <div className="flex items-center gap-2 bg-card px-3 py-1.5 rounded-lg border border-border-card">
                                            <span className="text-[10px] text-muted uppercase font-bold tracking-widest">Target Team:</span>
                                            <span className="text-xs text-white font-semibold">{assignedTeam}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                                        {extractedTasks.map((t, idx) => (
                                            <div key={idx} className="bg-card p-4 rounded-xl border border-border-card">
                                                <input 
                                                    type="text" 
                                                    value={t.task_name} 
                                                    onChange={e => {
                                                        const newT = [...extractedTasks];
                                                        newT[idx].task_name = e.target.value;
                                                        setExtractedTasks(newT);
                                                    }}
                                                    className="w-full bg-transparent text-white font-bold text-sm outline-none mb-2" 
                                                />
                                                <input 
                                                    type="text" 
                                                    value={t.task_description} 
                                                    onChange={e => {
                                                        const newT = [...extractedTasks];
                                                        newT[idx].task_description = e.target.value;
                                                        setExtractedTasks(newT);
                                                    }}
                                                    className="w-full bg-transparent text-muted text-xs outline-none" 
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <button onClick={() => setExtractedTasks([...extractedTasks, { task_name: "New Task", task_description: "" }])} className="text-xs text-blue-500 font-bold hover:underline bg-transparent border-none cursor-pointer">+ Add Task</button>
                                    
                                    <button onClick={handleBatchSubmit} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 mt-4 border-none cursor-pointer">
                                        Submit for Approval
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleCreateTask} className="space-y-6">
                                    <div>
                                        <label className="text-[10px] font-bold text-muted uppercase mb-2 block tracking-widest">Task Title</label>
                                        <input required autoFocus placeholder="What needs to be done?" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-card border border-border-card rounded-2xl p-4 text-white outline-none focus:border-primary text-sm sm:text-base" />
                                    </div>
                                    
                                    <div>
                                        <label className="text-[10px] font-bold text-muted uppercase mb-2 block tracking-widest">Description</label>
                                        <textarea rows={3} placeholder="Provide details about the task..." value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-card border border-border-card rounded-2xl p-4 text-white outline-none focus:border-primary text-sm sm:text-base resize-none custom-scrollbar" />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] font-bold text-muted uppercase mb-2 block tracking-widest">Assign Team</label>
                                            <CustomSelect value={assignedTeam} onChange={setAssignedTeam} options={teams} />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-bold text-muted uppercase mb-2 block tracking-widest">Priority</label>
                                            <CustomSelect value={priority} onChange={setPriority} options={priorities} />
                                        </div>
                                    </div>

                                    {assignedTeam === "Operations Team" && (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border border-border-card/50 p-4 rounded-[20px] bg-app">
                                            <div>
                                                <label className="text-[10px] font-bold text-muted uppercase mb-2 block tracking-widest">Task Scope</label>
                                                <CustomSelect value={taskScope} onChange={setTaskScope} options={["Central Team", "University"]} />
                                            </div>
                                            {taskScope === "University" && (
                                                <div>
                                                    <label className="text-[10px] font-bold text-muted uppercase mb-2 block tracking-widest">Select Universities</label>
                                                    <div className="flex flex-col gap-2 bg-card border border-border-card rounded-xl p-3">
                                                        {["VGU", "SGU", "ADYPU", "GMRIT"].map(uni => (
                                                            <label key={uni} className="flex items-center gap-2 cursor-pointer group">
                                                                <input 
                                                                    type="checkbox" 
                                                                    className="w-4 h-4 rounded border-hover text-red-500 focus:ring-red-500 bg-[#161b22] cursor-pointer"
                                                                    checked={selectedUniversities.includes(uni)}
                                                                    onChange={(e) => {
                                                                        if (e.target.checked) {
                                                                            setSelectedUniversities([...selectedUniversities, uni]);
                                                                        } else {
                                                                            setSelectedUniversities(selectedUniversities.filter(u => u !== uni));
                                                                        }
                                                                    }}
                                                                />
                                                                <span className="text-sm text-muted group-hover:text-gray-200 transition-colors font-medium">{uni}</span>
                                                            </label>
                                                        ))}
                                                        <div className="border-t border-border-card mt-1 pt-2">
                                                            <button 
                                                                type="button" 
                                                                onClick={() => {
                                                                    const allU = ["VGU", "SGU", "ADYPU", "GMRIT"];
                                                                    if (selectedUniversities.length === allU.length) setSelectedUniversities([]);
                                                                    else setSelectedUniversities(allU);
                                                                }}
                                                                className="text-[10px] uppercase font-bold text-blue-500 hover:text-blue-400 cursor-pointer bg-transparent border-none p-0"
                                                            >
                                                                {selectedUniversities.length === 4 ? "Deselect All" : "Select All Universities"}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <div className="border-t border-border-card pt-6 mt-6">
                                        <label className="text-[10px] font-bold text-muted uppercase mb-2 block tracking-widest">Or Upload SOP Document (Intelligent Extraction)</label>
                                        <div className="flex items-center justify-between gap-4 bg-card p-3 rounded-xl border border-border-card">
                                            <input type="file" onChange={e => setSopFile(e.target.files[0])} className="text-xs text-muted file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-500/10 file:text-blue-500 hover:file:bg-blue-500/20 cursor-pointer flex-1" />
                                            <button type="button" onClick={handleSopUpload} disabled={!sopFile || isUploadingSop} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold disabled:opacity-50 disabled:cursor-not-allowed border-none cursor-pointer shrink-0 transition-colors">
                                                {isUploadingSop ? "Parsing..." : "Extract Tasks"}
                                            </button>
                                        </div>
                                        <p className="text-[10px] text-gray-600 mt-2">Tasks will be extracted and sent to the selected Assign Team for approval.</p>
                                    </div>

                                    <button type="submit" className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 mt-4 border-none cursor-pointer">
                                        <Plus size={20} />
                                        Create Manual Task
                                    </button>
                                </form>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            </>
            ) : (
                <div className="flex-1 overflow-y-auto custom-scrollbar px-4 sm:px-8 pb-8 space-y-4">
                    {pendingApprovalTasks.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-muted">
                            <CheckCircle2 size={48} className="mb-4 opacity-50 text-green-500" />
                            <p className="font-bold text-lg">No Pending Approvals</p>
                            <p className="text-sm">You're all caught up!</p>
                        </div>
                    ) : (
                        pendingApprovalTasks.map(task => (
                            <div key={task.id} className="bg-card border border-border-card rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <h4 className="font-bold text-white text-lg">{task.title}</h4>
                                    <p className="text-sm text-muted mt-1">{task.description}</p>
                                    <div className="flex items-center gap-4 mt-3">
                                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border inline-block ${getPriorityColor(task.priority)}`}>
                                            {task.priority}
                                        </span>
                                        <span className="text-xs text-muted bg-gray-800/30 px-2 py-1 rounded-lg flex items-center gap-1.5">
                                            <Users size={12} /> {task.assigned_team}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-3">
                                    <button onClick={() => handleUpdateStatus(task.id, "Assigned")} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-xs font-bold border-none cursor-pointer transition-colors">
                                        Approve
                                    </button>
                                    <button onClick={() => handleUpdateStatus(task.id, "Rejected")} className="bg-app border border-hover hover:border-destructive hover:text-destructive text-muted px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors">
                                        Reject
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
