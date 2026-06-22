import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Edit2, Trash2, Calendar, MapPin, User, FileText, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { getCampusColor, campusColorMapping } from "../utils/campusColors";
import { API_URL } from "../config";
import axios from "axios";

export default function EventDrawer({ isOpen, onClose, event, onEdit, onDelete, onRefresh }) {
    const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
    const [feedbackData, setFeedbackData] = useState({
        feedback_summary: "",
        attendance_count: "",
        event_outcome: "",
        photos_link: ""
    });

    if (!event) return null;

    const colors = getCampusColor(event.university);
    const c = campusColorMapping[colors] ? {
        bg: `bg-${campusColorMapping[colors].replace('bg-', '')}`,
        text: `text-${campusColorMapping[colors].replace('bg-', '').replace('/10', '')}`
    } : { bg: "bg-gray-800", text: "text-gray-400" };

    const colorTheme = {
        purple: { bg: "bg-purple-500/10", border: "border-purple-500/20", text: "text-purple-500", glow: "shadow-purple-500/20" },
        red: { bg: "bg-red-500/10", border: "border-red-500/20", text: "text-red-500", glow: "shadow-red-500/20" },
        blue: { bg: "bg-blue-500/10", border: "border-blue-500/20", text: "text-blue-500", glow: "shadow-blue-500/20" },
        green: { bg: "bg-green-500/10", border: "border-green-500/20", text: "text-green-500", glow: "shadow-green-500/20" },
        orange: { bg: "bg-orange-500/10", border: "border-orange-500/20", text: "text-orange-500", glow: "shadow-orange-500/20" },
        gray: { bg: "bg-gray-500/10", border: "border-gray-500/20", text: "text-gray-500", glow: "shadow-gray-500/20" }
    };

    const theme = colorTheme[colors] || colorTheme.gray;

    const handleFeedbackSubmit = async () => {
        if (!feedbackData.feedback_summary || !feedbackData.attendance_count) {
            alert("Summary and Attendance are required.");
            return;
        }
        try {
            await axios.put(`${API_URL}/api/events/${event.id}`, {
                ...feedbackData,
                feedback_submitted: true
            });
            setIsSubmittingFeedback(false);
            onRefresh();
            onClose();
        } catch (err) {
            alert("Error submitting feedback");
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }} 
                        onClick={onClose} 
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
                    />
                    <motion.div 
                        initial={{ x: "100%" }} 
                        animate={{ x: 0 }} 
                        exit={{ x: "100%" }} 
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="relative z-10 w-full max-w-md h-full bg-[#161b22] border-l border-gray-800 shadow-2xl flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className={`p-6 sm:p-8 border-b border-gray-800 bg-gradient-to-b from-[#1c2128] to-[#161b22] relative overflow-hidden`}>
                            <div className={`absolute top-0 left-0 w-full h-1 ${theme.bg.replace('/10', '')}`} />
                            <div className="flex items-start justify-between mb-4 relative z-10">
                                <div className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border ${theme.bg} ${theme.text} ${theme.border}`}>
                                    {event.university}
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={onEdit} className="p-2 bg-[#1c2128] hover:bg-white/10 text-gray-400 hover:text-white rounded-xl transition-colors">
                                        <Edit2 size={16} />
                                    </button>
                                    <button onClick={onDelete} className="p-2 bg-[#1c2128] hover:bg-red-500/20 text-gray-400 hover:text-red-500 rounded-xl transition-colors">
                                        <Trash2 size={16} />
                                    </button>
                                    <button onClick={onClose} className="p-2 bg-[#1c2128] hover:bg-white/10 text-gray-400 hover:text-white rounded-xl transition-colors ml-2">
                                        <X size={16} />
                                    </button>
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2 relative z-10">{event.title}</h2>
                            <div className="flex items-center gap-2 text-sm text-gray-400 font-medium relative z-10">
                                <span className="bg-gray-800 px-2 py-0.5 rounded text-gray-300">{event.type}</span>
                                <span>•</span>
                                <span className={`flex items-center gap-1 ${event.status === 'Completed' ? 'text-green-500' : event.status === 'Cancelled' ? 'text-red-500' : event.status === 'In Progress' ? 'text-blue-500' : event.status === 'Postponed' ? 'text-orange-500' : 'text-gray-400'}`}>
                                    {event.status === 'Completed' ? <CheckCircle2 size={14} /> : event.status === 'Cancelled' ? <X size={14} /> : event.status === 'In Progress' ? <Clock size={14} /> : <AlertCircle size={14} />}
                                    {event.status || 'Scheduled'}
                                </span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8 custom-scrollbar">
                            
                            {/* Date & Time */}
                            <div className="space-y-4">
                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Schedule</h4>
                                <div className="bg-[#1c2128]/50 p-4 rounded-2xl border border-gray-800 flex items-start gap-4">
                                    <div className={`p-3 rounded-xl ${theme.bg} ${theme.text}`}>
                                        <Calendar size={20} />
                                    </div>
                                    <div>
                                        <p className="text-white font-medium">{event.date.split('T')[0]} {event.end_date && event.end_date !== event.date ? `to ${event.end_date.split('T')[0]}` : ''}</p>
                                        {(event.start_time || event.end_time) && (
                                            <p className="text-sm text-gray-500 mt-0.5">{event.start_time || 'TBD'} - {event.end_time || 'TBD'}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Logistics */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Venue / Link</h4>
                                    <div className="flex items-center gap-2 text-sm text-gray-300">
                                        <MapPin size={14} className="text-gray-500" />
                                        <span>{event.venue || 'Not specified'}</span>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Coordinator</h4>
                                    <div className="flex items-center gap-2 text-sm text-gray-300">
                                        <User size={14} className="text-gray-500" />
                                        <span>{event.coordinator || 'Unassigned'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            {event.description && (
                                <div>
                                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Description</h4>
                                    <p className="text-sm text-gray-300 leading-relaxed bg-[#1c2128]/30 p-4 rounded-2xl border border-gray-800/50">
                                        {event.description}
                                    </p>
                                </div>
                            )}

                            {/* Cancelled / Postponed Remarks */}
                            {(event.status === 'Cancelled' || event.status === 'Postponed') && event.remarks && (
                                <div>
                                    <h4 className={`text-xs font-bold uppercase tracking-widest mb-3 ${event.status === 'Cancelled' ? 'text-red-500' : 'text-orange-500'}`}>
                                        {event.status} Remarks
                                    </h4>
                                    <div className={`p-4 rounded-2xl border ${event.status === 'Cancelled' ? 'bg-red-500/5 border-red-500/20' : 'bg-orange-500/5 border-orange-500/20'}`}>
                                        <p className="text-sm text-gray-300">{event.remarks}</p>
                                    </div>
                                </div>
                            )}

                            {/* Feedback Section */}
                            {event.status === 'Completed' && (
                                <div className="border-t border-gray-800 pt-8 mt-8">
                                    <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
                                        <FileText size={18} className="text-green-500" />
                                        Event Feedback
                                    </h4>

                                    {event.feedback_submitted ? (
                                        <div className="space-y-4">
                                            <div className="bg-green-500/5 border border-green-500/20 p-4 rounded-2xl">
                                                <div className="grid grid-cols-2 gap-4 mb-4">
                                                    <div>
                                                        <span className="text-[10px] text-gray-500 uppercase tracking-widest block mb-1">Attendance</span>
                                                        <span className="text-lg font-bold text-white">{event.attendance_count}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-[10px] text-gray-500 uppercase tracking-widest block mb-1">Outcome</span>
                                                        <span className="text-sm font-medium text-white">{event.event_outcome || 'N/A'}</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <span className="text-[10px] text-gray-500 uppercase tracking-widest block mb-1">Summary</span>
                                                    <p className="text-sm text-gray-300">{event.feedback_summary}</p>
                                                </div>
                                                {event.photos_link && (
                                                    <div className="mt-4 pt-4 border-t border-green-500/10">
                                                        <a href={event.photos_link} target="_blank" rel="noopener noreferrer" className="text-xs text-green-500 hover:underline">View Event Photos</a>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        isSubmittingFeedback ? (
                                            <div className="space-y-4 bg-[#1c2128]/50 p-5 rounded-2xl border border-gray-800">
                                                <div>
                                                    <label className="text-[10px] text-gray-500 uppercase tracking-widest block mb-2">Feedback Summary *</label>
                                                    <textarea 
                                                        value={feedbackData.feedback_summary}
                                                        onChange={e => setFeedbackData({...feedbackData, feedback_summary: e.target.value})}
                                                        className="w-full bg-[#161b22] border border-gray-700 rounded-xl p-3 text-white text-sm outline-none focus:border-green-500 min-h-[80px]"
                                                        placeholder="How did the event go?"
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="text-[10px] text-gray-500 uppercase tracking-widest block mb-2">Attendance *</label>
                                                        <input 
                                                            type="number"
                                                            value={feedbackData.attendance_count}
                                                            onChange={e => setFeedbackData({...feedbackData, attendance_count: e.target.value})}
                                                            className="w-full bg-[#161b22] border border-gray-700 rounded-xl p-3 text-white text-sm outline-none focus:border-green-500"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] text-gray-500 uppercase tracking-widest block mb-2">Outcome</label>
                                                        <select 
                                                            value={feedbackData.event_outcome}
                                                            onChange={e => setFeedbackData({...feedbackData, event_outcome: e.target.value})}
                                                            className="w-full bg-[#161b22] border border-gray-700 rounded-xl p-3 text-white text-sm outline-none focus:border-green-500"
                                                        >
                                                            <option value="">Select...</option>
                                                            <option value="Successful">Successful</option>
                                                            <option value="Average">Average</option>
                                                            <option value="Poor">Poor</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="text-[10px] text-gray-500 uppercase tracking-widest block mb-2">Photos Link</label>
                                                    <input 
                                                        type="url"
                                                        value={feedbackData.photos_link}
                                                        onChange={e => setFeedbackData({...feedbackData, photos_link: e.target.value})}
                                                        className="w-full bg-[#161b22] border border-gray-700 rounded-xl p-3 text-white text-sm outline-none focus:border-green-500"
                                                        placeholder="https://..."
                                                    />
                                                </div>
                                                <div className="flex gap-2 pt-2">
                                                    <button onClick={handleFeedbackSubmit} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 rounded-xl transition-colors text-sm">Submit</button>
                                                    <button onClick={() => setIsSubmittingFeedback(false)} className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-bold py-2.5 rounded-xl transition-colors text-sm">Cancel</button>
                                                </div>
                                            </div>
                                        ) : (
                                            <button 
                                                onClick={() => setIsSubmittingFeedback(true)}
                                                className="w-full bg-green-500/10 hover:bg-green-500/20 text-green-500 border border-green-500/30 py-4 rounded-2xl font-bold transition-all flex items-center justify-center gap-2"
                                            >
                                                <CheckCircle2 size={18} />
                                                Submit Event Feedback
                                            </button>
                                        )
                                    )}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
