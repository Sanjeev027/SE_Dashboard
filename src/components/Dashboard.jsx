import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import axios from "axios";
import {
    LayoutDashboard,
    GraduationCap,
    FileText,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    Plus,
    Search,
    Bell,
    Calendar as CalendarIcon,
    Menu,
    User,
    Clock,
    X,
    Trash2,
    CheckCircle2,
    ShieldCheck,
    Globe,
    LogOut,
    Users,
    Activity,
    Eye,
    Sun,
    Moon,
    LayoutList
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import UserManagement from "./UserManagement";
import TaskBoard from "./TaskBoard";
import { API_URL } from "../config";
import { CustomSelect } from "./CustomSelect";
import { getCampusColor, campusColorMapping } from "../utils/campusColors";

const getColorClasses = (color) => {
    const maps = {
        purple: {
            bg: "bg-purple-500/10",
            border: "border-purple-500",
            borderLight: "border-purple-500/20",
            text: "text-purple-500"
        },
        red: {
            bg: "bg-red-500/10",
            border: "border-red-500",
            borderLight: "border-red-500/20",
            text: "text-red-500"
        },
        blue: {
            bg: "bg-blue-500/10",
            border: "border-blue-500",
            borderLight: "border-blue-500/20",
            text: "text-blue-500"
        },
        green: {
            bg: "bg-green-500/10",
            border: "border-green-500",
            borderLight: "border-green-500/20",
            text: "text-green-500"
        },
        orange: {
            bg: "bg-orange-500/10",
            border: "border-orange-500",
            borderLight: "border-orange-500/20",
            text: "text-orange-500"
        }
    };
    return maps[color] || {
        bg: "bg-gray-500/10",
        border: "border-gray-500",
        borderLight: "border-gray-500/20",
        text: "text-gray-500"
    };
};

const SidebarItem = ({ icon: Icon, label, active, onClick }) => (
    <motion.div
        whileHover={{ x: 5, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
        onClick={onClick}
        className={`relative flex items-center gap-3 px-4 py-3 cursor-pointer rounded-xl transition-colors ${active ? "text-white" : "text-gray-400"
            }`}
    >
        {active && (
            <motion.div
                layoutId="activeTabHighlight"
                className="absolute inset-0 bg-red-600 shadow-lg rounded-xl"
                initial={false}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
        )}
        <div className="relative z-10 flex items-center gap-3">
            <Icon size={20} />
            <span className="font-medium">{label}</span>
        </div>
    </motion.div>
);



const CustomDatePicker = ({ value, onChange, placeholder = "Select Date" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const datePickerRef = useRef(null);
    const [currentMonth, setCurrentMonth] = useState(value ? new Date(value) : new Date());

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
    const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

    const calendarDays = [];
    for (let i = 0; i < firstDay; i++) calendarDays.push(null);
    for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

    const handlePrevMonth = (e) => {
        e.stopPropagation();
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    const handleNextMonth = (e) => {
        e.stopPropagation();
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    const handleSelectDate = (day) => {
        const year = currentMonth.getFullYear();
        const month = String(currentMonth.getMonth() + 1).padStart(2, '0');
        const dayStr = String(day).padStart(2, '0');
        onChange(`${year}-${month}-${dayStr}`);
        setIsOpen(false);
    };

    return (
        <div ref={datePickerRef} className="relative w-full">
            <div 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full bg-[#1c2128] border border-gray-800 rounded-2xl p-4 text-gray-300 outline-none hover:border-red-600/50 focus:border-red-600 transition-colors text-sm sm:text-base flex justify-between items-center cursor-pointer select-none"
            >
                <span>{value || placeholder}</span>
                <CalendarIcon size={18} className={`transition-colors duration-300 ${isOpen ? "text-red-500" : "text-gray-500"}`} />
            </div>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="absolute z-50 w-[280px] sm:w-[320px] left-0 mt-2 bg-[#161b22] border border-gray-800 rounded-3xl shadow-2xl p-4"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <button onClick={handlePrevMonth} className="p-2 hover:bg-gray-800 rounded-xl text-gray-400 hover:text-white transition-colors">
                                <ChevronLeft size={16} />
                            </button>
                            <span className="text-white font-bold text-sm">
                                {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                            </span>
                            <button onClick={handleNextMonth} className="p-2 hover:bg-gray-800 rounded-xl text-gray-400 hover:text-white transition-colors">
                                <ChevronRight size={16} />
                            </button>
                        </div>
                        <div className="grid grid-cols-7 gap-1 mb-2">
                            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                                <div key={d} className="text-center text-[10px] font-bold text-gray-500 uppercase tracking-widest">{d}</div>
                            ))}
                        </div>
                        <div className="grid grid-cols-7 gap-1">
                            {calendarDays.map((day, idx) => {
                                if (!day) return <div key={idx} className="p-2"></div>;
                                const isSelected = value && new Date(value).getDate() === day && new Date(value).getMonth() === currentMonth.getMonth() && new Date(value).getFullYear() === currentMonth.getFullYear();
                                const isToday = day === new Date().getDate() && currentMonth.getMonth() === new Date().getMonth() && currentMonth.getFullYear() === new Date().getFullYear();
                                return (
                                    <div
                                        key={idx}
                                        onClick={() => handleSelectDate(day)}
                                        className={`p-2 text-center text-xs sm:text-sm rounded-xl cursor-pointer transition-all flex items-center justify-center h-8 sm:h-10 font-medium select-none ${
                                            isSelected ? "bg-red-600 text-white shadow-lg shadow-red-600/30 ring-2 ring-red-600 ring-offset-2 ring-offset-[#161b22]" 
                                            : isToday ? "bg-white/10 text-white" 
                                            : "text-gray-300 hover:bg-gray-800 hover:text-white"
                                        }`}
                                    >
                                        {day}
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState("Dashboard");
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isEventModalOpen, setIsEventModalOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedUniTab, setSelectedUniTab] = useState("All Universities");
    const [selectedUniTypeFilter, setSelectedUniTypeFilter] = useState("All");
    const [calendarUniFilter, setCalendarUniFilter] = useState("All Universities");
    const [calendarTypeFilter, setCalendarTypeFilter] = useState("All");
    const [expandedUnis, setExpandedUnis] = useState({});

    // Theme state
    // Force dark mode
    useEffect(() => {
        document.documentElement.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
    }, []);

    // Form states
    const [newTitle, setNewTitle] = useState("");
    const [newType, setNewType] = useState("Circular");
    const [newUniversity, setNewUniversity] = useState("");
    const [newEventDate, setNewEventDate] = useState("");
    const [newEventEndDate, setNewEventEndDate] = useState("");

    // Report states
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [selectedEventForReport, setSelectedEventForReport] = useState(null);
    const [reportContentText, setReportContentText] = useState("");
    const [reportFeedbackText, setReportFeedbackText] = useState("");
    const [reportFeedbackSummaryText, setReportFeedbackSummaryText] = useState("");
    const [reportStudentsRegisteredCount, setReportStudentsRegisteredCount] = useState("");
    const [reportStudentsAttendedCount, setReportStudentsAttendedCount] = useState("");
    const [reportHighlightsText, setReportHighlightsText] = useState("");
    const [reportDescriptionText, setReportDescriptionText] = useState("");
    const [reportDriveLinkText, setReportDriveLinkText] = useState("");
    const [selectedReportFilterUni, setSelectedReportFilterUni] = useState("All");
    const [selectedReportFilterType, setSelectedReportFilterType] = useState("All");
    const [isViewReportModalOpen, setIsViewReportModalOpen] = useState(false);
    const [viewingReport, setViewingReport] = useState(null);

    // Events state
    const [events, setEvents] = useState({});
    const [reports, setReports] = useState([]);

    const fetchReports = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/events/reports/all`);
            setReports(res.data);
        } catch (err) {
            console.error("Error fetching reports", err);
        }
    };

    const fetchEvents = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/events`);
            // Transform array to grouped object { "YYYY-MM-DD": [...] }
            const grouped = res.data.reduce((acc, event) => {
                const startStr = event.date.split('T')[0];
                const endStr = (event.end_date || event.date).split('T')[0];

                if (startStr === endStr) {
                    if (!acc[startStr]) acc[startStr] = [];
                    acc[startStr].push(event);
                } else {
                    let current = new Date(startStr + 'T00:00:00');
                    const end = new Date(endStr + 'T00:00:00');
                    while (current <= end) {
                        const year = current.getFullYear();
                        const month = String(current.getMonth() + 1).padStart(2, '0');
                        const day = String(current.getDate()).padStart(2, '0');
                        const dateKey = `${year}-${month}-${day}`;

                        if (!acc[dateKey]) acc[dateKey] = [];
                        acc[dateKey].push(event);

                        current.setDate(current.getDate() + 1);
                    }
                }
                return acc;
            }, {});
            setEvents(grouped);
            fetchReports();
        } catch (err) {
            console.error("Error fetching events", err);
        }
    };

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            setNewUniversity(parsedUser.university === "All Universities" ? "VGU" : parsedUser.university);
            if (parsedUser.role !== "central") {
                setSelectedUniTab(parsedUser.university);
            }
            fetchEvents();

            // Fetch latest user details to sync with any database updates (e.g. university assignment)
            const syncUser = async () => {
                try {
                    const res = await axios.get(`${API_URL}/api/users/${parsedUser.id}`);
                    const latestUser = {
                        id: res.data.id,
                        loginId: res.data.loginId || res.data.login_id,
                        email: res.data.email,
                        role: res.data.role,
                        university: res.data.university
                    };
                    localStorage.setItem("user", JSON.stringify(latestUser));
                    setUser(latestUser);
                    setNewUniversity(latestUser.university === "All Universities" ? "VGU" : latestUser.university);
                    if (latestUser.role !== "central") {
                        setSelectedUniTab(latestUser.university);
                    }
                } catch (err) {
                    console.error("Error syncing user data:", err);
                }
            };
            syncUser();
        } else {
            navigate("/login");
        }
    }, [navigate]);

    useEffect(() => {
        if (isEventModalOpen && selectedDate) {
            const year = selectedDate.getFullYear();
            const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
            const day = String(selectedDate.getDate()).padStart(2, '0');
            const dateStr = `${year}-${month}-${day}`;
            setNewEventDate(dateStr);
            setNewEventEndDate(dateStr);

            // Reset university choice to VGU if user is central admin, or to their assigned university for managers
            if (user) {
                if (user.role === "central") {
                    setNewUniversity("VGU");
                } else {
                    setNewUniversity(user.university);
                }
            }
        }
    }, [isEventModalOpen, selectedDate, user]);

    const isCentral = user?.role === "central";

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());

    const calendarDays = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
        calendarDays.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        calendarDays.push(i);
    }
    while (calendarDays.length % 7 !== 0) {
        calendarDays.push(null);
    }

    const getDateString = (day) => {
        if (!day) return null;
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const dayStr = String(day).padStart(2, '0');
        return `${year}-${month}-${dayStr}`;
    };

    const handleDateClick = (day) => {
        if (!day) return;
        const d = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        setSelectedDate(d);

        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const dayStr = String(d.getDate()).padStart(2, '0');
        const formattedDate = `${year}-${month}-${dayStr}`;
        
        setNewEventDate(formattedDate);
        setNewEventEndDate(formattedDate);
        setNewUniversity(isCentral ? "All Universities" : user?.university || "");
        setIsEventModalOpen(true);
    };

    const handleAddEvent = async () => {
        if (!newTitle.trim()) {
            alert("Please enter an event title");
            return;
        }
        if (!newEventDate) {
            alert("Please select a start date");
            return;
        }
        if (!newEventEndDate) {
            alert("Please select an end date");
            return;
        }
        if (new Date(newEventEndDate) < new Date(newEventDate)) {
            alert("End date cannot be before start date");
            return;
        }

        if (!isCentral && newUniversity !== user.university) {
            alert("no access to add for this university");
            return;
        }

        const typeColors = { 
            "Circular": "purple", 
            "Co-Circular": "red", 
            "Extra-Circular": "blue", 
            "Cultural Activities": "green", 
            "Other": "orange" 
        };

        const eventData = {
            title: newTitle,
            type: newType,
            university: newUniversity,
            date: newEventDate,
            end_date: newEventEndDate,
            color: typeColors[newType] || "gray"
        };

        try {
            await axios.post(`${API_URL}/api/events`, eventData);
            fetchEvents();
            setNewTitle("");
            setIsEventModalOpen(false);
        } catch (err) {
            alert("Error saving event");
        }
    };

    const handleDeleteEvent = async (eventId) => {
        try {
            await axios.delete(`${API_URL}/api/events/${eventId}`);
            fetchEvents();
        } catch (err) {
            alert("Error deleting event");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/login");
    };

    const filterEvents = (dayEvents) => {
        if (!dayEvents) return [];
        let filtered = dayEvents;
        if (!isCentral) {
            filtered = filtered.filter(e => e.university?.toLowerCase() === user?.university?.toLowerCase() || e.university === "All Universities");
        }
        if (calendarUniFilter !== "All Universities") {
            filtered = filtered.filter(e => e.university === calendarUniFilter || e.university === "All Universities");
        }
        if (calendarTypeFilter !== "All") {
            filtered = filtered.filter(e => e.type === calendarTypeFilter);
        }
        return filtered;
    };

    const getLocalDateStr = (date) => {
        if (!date) return "";
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const selectedDateString = getLocalDateStr(selectedDate);
    const selectedDayEvents = filterEvents(events[selectedDateString]);

    const getCompletedEvents = () => {
        const unique = Object.values(events).flat().filter((event, index, self) => 
            self.findIndex(e => e.id === event.id) === index
        );
        
        if (isCentral) {
            return unique;
        }
        return unique.filter(e => e.university?.toLowerCase() === user?.university?.toLowerCase());
    };

    const handleSubmittingReport = async () => {
        if (!reportStudentsRegisteredCount) {
            alert("Please enter students registered count");
            return;
        }
        if (!reportStudentsAttendedCount) {
            alert("Please enter students attended count");
            return;
        }
        if (!reportDescriptionText.trim()) {
            alert("Please enter event description");
            return;
        }
        if (!reportHighlightsText.trim()) {
            alert("Please enter event highlights");
            return;
        }
        if (!reportFeedbackText.trim()) {
            alert("Please enter event feedback");
            return;
        }
        if (!reportFeedbackSummaryText.trim()) {
            alert("Please enter event feedback summary");
            return;
        }
        if (!reportDriveLinkText.trim()) {
            alert("Please enter photos/drive link");
            return;
        }
        try {
            const uniToSubmit = selectedEventForReport.university === "All Universities" 
                ? (selectedEventForReport.groupUni || user.university) 
                : selectedEventForReport.university;

            if (!isCentral && uniToSubmit?.toLowerCase() !== user.university?.toLowerCase()) {
                alert("no access to submit report for this university");
                return;
            }

            const serializedContent = JSON.stringify({
                feedback: reportFeedbackText,
                feedbackSummary: reportFeedbackSummaryText,
                studentsRegistered: reportStudentsRegisteredCount,
                studentsCount: reportStudentsAttendedCount,
                highlights: reportHighlightsText,
                description: reportDescriptionText,
                driveLink: reportDriveLinkText
            });

            await axios.post(`${API_URL}/api/events/${selectedEventForReport.id}/report`, {
                reportContent: serializedContent,
                university: uniToSubmit
            });
            alert("Report submitted successfully");
            setReportFeedbackText("");
            setReportFeedbackSummaryText("");
            setReportStudentsRegisteredCount("");
            setReportStudentsAttendedCount("");
            setReportHighlightsText("");
            setReportDescriptionText("");
            setReportDriveLinkText("");
            setIsReportModalOpen(false);
            fetchEvents();
        } catch (err) {
            alert("Error submitting report");
        }
    };

    if (!user) return <div className="h-screen w-screen bg-[#0f1115] flex items-center justify-center text-white">Loading...</div>;

    return (
        <div className="flex h-screen w-screen bg-[#0f1115] text-white overflow-hidden font-sans relative">
            {/* Mobile Sidebar Backdrop */}
            {isSidebarOpen && (
                <div 
                    onClick={() => setIsSidebarOpen(false)} 
                    className="fixed inset-0 z-30 bg-black/60 lg:hidden"
                />
            )}

            {/* Sidebar */}
            <aside 
                className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-gray-800 flex flex-col p-6 bg-[#161b22] transition-transform duration-300 lg:static lg:translate-x-0 ${
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="flex items-center justify-between mb-10 px-2">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#1c2128] border border-gray-800 rounded-lg flex items-center justify-center shadow-lg shadow-red-600/5 text-red-500">
                            <GraduationCap size={20} />
                        </div>
                        <h1 className="text-xl font-bold tracking-tight">Academia_HuB</h1>
                    </div>
                    {/* Close button for mobile sidebar */}
                    <button 
                        onClick={() => setIsSidebarOpen(false)} 
                        className="p-1 text-gray-400 hover:text-white lg:hidden bg-transparent border-none"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="mb-6 px-2">
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider w-fit ${isCentral ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'}`}>
                        {isCentral ? <ShieldCheck size={12} /> : <Globe size={12} />}
                        {isCentral ? "Admin" : "PM/PMA"}
                    </div>
                    {!isCentral && <p className="text-[11px] text-gray-500 mt-2 font-medium">{user.university}</p>}
                </div>

                <nav className="flex-1 space-y-2">
                    <LayoutGroup>
                        <SidebarItem icon={LayoutDashboard} label="Dashboard" active={activeTab === "Users" ? false : activeTab === "Dashboard"} onClick={() => { setActiveTab("Dashboard"); setIsSidebarOpen(false); }} />
                        <SidebarItem icon={GraduationCap} label="University" active={activeTab === "University"} onClick={() => { setActiveTab("University"); setIsSidebarOpen(false); }} />
                        <SidebarItem icon={FileText} label="Report" active={activeTab === "Report"} onClick={() => { setActiveTab("Report"); setIsSidebarOpen(false); }} />

                        {isCentral && (
                            <SidebarItem
                                icon={Users}
                                label="Admin Panel"
                                active={activeTab === "Users"}
                                onClick={() => { setActiveTab("Users"); setIsSidebarOpen(false); }}
                            />
                        )}
                        <SidebarItem
                            icon={LayoutList}
                            label="Task Board"
                            active={activeTab === "Tasks"}
                            onClick={() => { setActiveTab("Tasks"); setIsSidebarOpen(false); }}
                        />
                    </LayoutGroup>
                </nav>

                <div className="mt-auto pt-6 border-t border-gray-800 space-y-2">
                    <div className="flex items-center gap-3 px-2 py-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-red-600 to-orange-500 flex items-center justify-center font-bold">
                            {(user.loginId || "User")[0].toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate">{user.loginId || "User"}</p>
                            <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-red-600/10 rounded-xl transition-all group bg-transparent border-none"
                    >
                        <LogOut size={20} className="group-hover:text-red-500 transition-colors" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            <main className="flex-1 flex flex-col overflow-hidden bg-[#0f1115]">
                {/* Header */}
                <header className="h-20 border-b border-gray-800 flex items-center justify-between px-4 sm:px-8 bg-[#161b22]/50 backdrop-blur-md shrink-0">
                    <div className="flex items-center gap-3 sm:gap-4 flex-1">
                        {/* Hamburger Menu Toggle on Mobile */}
                        <button 
                            onClick={() => setIsSidebarOpen(true)} 
                            className="p-2 -ml-2 text-gray-400 hover:text-white lg:hidden bg-transparent border-none"
                        >
                            <Menu size={24} />
                        </button>
                        <div className="flex items-center gap-4 bg-gray-800/50 px-4 py-2 rounded-xl w-full max-w-xs sm:max-w-sm">
                            <Search size={18} className="text-gray-500" />
                            <input type="text" placeholder={`Search ${activeTab === "Users" ? "users" : (isCentral ? 'all' : 'university')} events...`} className="bg-transparent border-none outline-none text-sm w-full" />
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={() => {
                            setNewUniversity(isCentral ? "All Universities" : user?.university || "");
                            setIsEventModalOpen(true);
                        }} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 transition-all px-3 sm:px-5 py-2.5 rounded-xl font-medium shadow-lg shadow-red-600/20 text-xs sm:text-sm">
                            <Plus size={18} />
                            <span>Add Schedule</span>
                        </button>
                    </div>
                </header>

                <div className="relative flex-1 overflow-hidden">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
                            transition={{ duration: 0.2 }}
                            className="absolute inset-0 flex flex-col xl:flex-row overflow-y-auto xl:overflow-hidden"
                        >
                            {activeTab === "Users" ? (
                        <div className="flex-1 overflow-hidden">
                            <UserManagement />
                        </div>
                    ) : activeTab === "Tasks" ? (
                        <div className="flex-1 overflow-hidden">
                            <TaskBoard />
                        </div>
                    ) : activeTab === "Report" ? (
                        <div className="flex-1 p-4 sm:p-8 overflow-y-auto flex flex-col gap-6">
                            <div>
                                <h2 className="text-xl sm:text-3xl font-black mb-2 flex items-center gap-2">
                                    <FileText className="text-red-500 animate-pulse" size={32} />
                                    Report Submission Tracker
                                </h2>
                                <p className="text-sm text-gray-500">Track, monitor, and submit event execution reports for all completed activities.</p>
                            </div>

                            {/* Summary Cards */}
                            {(() => {
                                const completedList = getCompletedEvents();
                                let targetUnis = [];
                                if (isCentral) {
                                    if (selectedReportFilterUni === "All") {
                                        targetUnis = ["VGU", "sgu", "adypu"];
                                    } else {
                                        targetUnis = [selectedReportFilterUni];
                                    }
                                } else {
                                    targetUnis = [user.university];
                                }

                                const typeFilteredEvents = completedList.filter(e => {
                                    if (selectedReportFilterType === "All") return true;
                                    return e.type === selectedReportFilterType;
                                });

                                let totalCompletedCount = 0;
                                let submittedCount = 0;
                                
                                targetUnis.forEach(uni => {
                                    const uniEvents = typeFilteredEvents.filter(e => {
                                        if (isCentral) {
                                            return e.university?.toLowerCase() === uni?.toLowerCase() || e.university === "All Universities";
                                        }
                                        return e.university?.toLowerCase() === uni?.toLowerCase();
                                    });
                                    totalCompletedCount += uniEvents.length;
                                    submittedCount += uniEvents.filter(e => {
                                        const report = reports.find(r => r.event_id == e.id && r.university?.toLowerCase() === uni?.toLowerCase());
                                        return !!report;
                                    }).length;
                                });
                                
                                const pendingCount = totalCompletedCount - submittedCount;

                                return (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 shrink-0">
                                        <div className="bg-[#1c2128]/50 border border-gray-800 p-5 rounded-2xl flex items-center justify-between backdrop-blur-md">
                                            <div>
                                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Total Completed Events</p>
                                                <p className="text-2xl font-black text-white">{totalCompletedCount}</p>
                                            </div>
                                            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-500">
                                                <FileText size={20} />
                                            </div>
                                        </div>

                                        <div className="bg-[#1c2128]/50 border border-gray-800 p-5 rounded-2xl flex items-center justify-between backdrop-blur-md">
                                            <div>
                                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Reports Submitted</p>
                                                <p className="text-2xl font-black text-green-500">{submittedCount}</p>
                                            </div>
                                            <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-500">
                                                <CheckCircle2 size={20} />
                                            </div>
                                        </div>

                                        <div className="bg-[#1c2128]/50 border border-gray-800 p-5 rounded-2xl flex items-center justify-between backdrop-blur-md">
                                            <div>
                                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Reports Pending</p>
                                                <p className="text-2xl font-black text-red-500">{pendingCount}</p>
                                            </div>
                                            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
                                                <Clock size={20} />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })()}

                            {/* Reports List */}
                            <div className="bg-[#161b22]/30 border border-gray-800 rounded-[2rem] p-6 flex flex-col gap-6 flex-1 overflow-hidden min-h-[400px]">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-4 shrink-0">
                                    <h3 className="font-bold text-base text-gray-200">Completed Events & Report Logs</h3>
                                    <div className="flex flex-wrap items-center gap-4">
                                        {/* Campus Filter */}
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Campus:</span>
                                            {isCentral ? (
                                                <CustomSelect 
                                                    value={selectedReportFilterUni} 
                                                    onChange={setSelectedReportFilterUni}
                                                    options={[
                                                        {label: "All Campuses", value: "All"}, 
                                                        {label: "VGU", value: "VGU"}, 
                                                        {label: "SGU", value: "SGU"}, 
                                                        {label: "ADYPU", value: "ADYPU"}
                                                    ]}
                                                    padding="py-1.5 px-3"
                                                    textSize="text-xs"
                                                    dropdownPadding="py-2 px-3"
                                                    dropdownTextSize="text-xs"
                                                    className="w-40"
                                                />
                                            ) : (
                                                <div className="bg-gray-800/30 border border-gray-800/80 rounded-xl px-3 py-1.5 text-xs text-gray-400 font-semibold font-sans">
                                                    {user.university}
                                                </div>
                                            )}
                                        </div>

                                        {/* Event Type Filter */}
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Event Type:</span>
                                            <CustomSelect 
                                                value={selectedReportFilterType} 
                                                onChange={setSelectedReportFilterType}
                                                options={[
                                                    {label: "All Types", value: "All"}, 
                                                    "Circular", "Co-Circular", "Extra-Circular", "Cultural Activities", "Other"
                                                ]}
                                                padding="py-1.5 px-3"
                                                textSize="text-xs"
                                                dropdownPadding="py-2 px-3"
                                                dropdownTextSize="text-xs"
                                                className="w-40"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                                    {(() => {
                                        const allCompleted = getCompletedEvents();
                                        
                                        const typeFilteredEvents = allCompleted.filter(e => {
                                            if (selectedReportFilterType === "All") return true;
                                            return e.type === selectedReportFilterType;
                                        });

                                        const targetUnis = isCentral 
                                            ? (selectedReportFilterUni === "All" ? ["VGU", "sgu", "adypu"] : [selectedReportFilterUni])
                                            : [user.university];

                                        return targetUnis.map(uni => {
                                            const uniEvents = typeFilteredEvents.filter(e => {
                                                if (isCentral) {
                                                    return e.university?.toLowerCase() === uni?.toLowerCase() || e.university === "All Universities";
                                                }
                                                return e.university?.toLowerCase() === uni?.toLowerCase();
                                            });
                                            
                                            const submittedCount = uniEvents.filter(e => {
                                                const report = reports.find(r => r.event_id == e.id && r.university?.toLowerCase() === uni?.toLowerCase());
                                                return !!report;
                                            }).length;
                                            const pendingCount = uniEvents.length - submittedCount;

                                            const isExpanded = !!expandedUnis[uni];
                                            const toggleUniExpand = (uniName) => {
                                                setExpandedUnis(prev => ({
                                                    ...prev,
                                                    [uniName]: !prev[uniName]
                                                }));
                                            };

                                            return (
                                                <div key={uni} className="bg-[#1c2128]/20 border border-gray-800/80 rounded-[1.5rem] p-5 flex flex-col gap-4 mb-6">
                                                    {/* Group Header */}
                                                    <div 
                                                        onClick={() => toggleUniExpand(uni)}
                                                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-800/60 pb-3 cursor-pointer select-none hover:opacity-80 transition-all"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            {isExpanded ? <ChevronDown size={18} className="text-gray-500 shrink-0" /> : <ChevronRight size={18} className="text-gray-500 shrink-0" />}
                                                            <div>
                                                                <h4 className="text-sm font-black text-red-500 uppercase tracking-widest">{uni}</h4>
                                                                <p className="text-[11px] text-gray-500">Execution performance tracking for this campus (Click to {isExpanded ? 'collapse' : 'expand'})</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <span className="text-[10px] font-bold text-green-500 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-lg">
                                                                {submittedCount} Submitted
                                                            </span>
                                                            <span className="text-[10px] font-bold text-red-500 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded-lg">
                                                                {pendingCount} Pending
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Group Events */}
                                                    {isExpanded && (
                                                        <div className="space-y-3 mt-1">
                                                            {uniEvents.length === 0 ? (
                                                                <p className="text-xs text-gray-600 italic py-2">No completed events scheduled for this campus.</p>
                                                            ) : (
                                                                uniEvents.map(event => {
                                                                    const report = reports.find(r => r.event_id == event.id && r.university?.toLowerCase() === uni?.toLowerCase());
                                                                    const isReportSubmitted = !!report;
                                                                    const reportContent = report ? report.report_content : null;

                                                                    return (
                                                                        <div key={event.id} className="bg-[#1c2128]/50 p-4 rounded-xl border border-gray-800/60 hover:border-gray-700/80 transition-colors flex flex-col gap-3">
                                                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                                                                <div className="space-y-1">
                                                                                    <div className="flex items-center gap-2">
                                                                                        <span className="text-[8px] font-bold uppercase px-2 py-0.5 rounded bg-gray-800/80 text-gray-400 border border-gray-700/50">
                                                                                            {event.type}
                                                                                        </span>
                                                                                        <span className="text-[10px] text-gray-500 font-semibold flex items-center gap-1">
                                                                                            <Clock size={11} />
                                                                                            {event.date.split('T')[0]} {event.end_date && event.end_date !== event.date ? `to ${event.end_date.split('T')[0]}` : ''}
                                                                                        </span>
                                                                                    </div>
                                                                                    <h5 className="font-bold text-gray-200 uppercase tracking-tight text-sm">
                                                                                        {event.title} {event.university === "All Universities" && <span className="text-[9px] text-amber-500 font-bold bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20 ml-2">Global Event</span>}
                                                                                    </h5>
                                                                                </div>

                                                                                <div className="flex items-center gap-3 shrink-0">
                                                                                    {isReportSubmitted ? (
                                                                                        <div className="flex items-center gap-2">
                                                                                            <span className="text-[10px] font-bold text-green-500 bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-xl flex items-center gap-1">
                                                                                                <CheckCircle2 size={12} /> Submitted
                                                                                            </span>
                                                                                            {isCentral && (
                                                                                                <button
                                                                                                    onClick={() => {
                                                                                                        setViewingReport({
                                                                                                            eventTitle: event.title,
                                                                                                            reportContent: reportContent,
                                                                                                            university: uni,
                                                                                                            date: event.date.split('T')[0],
                                                                                                            eventType: event.type
                                                                                                        });
                                                                                                        setIsViewReportModalOpen(true);
                                                                                                    }}
                                                                                                    className="p-2 bg-[#1c2128] border border-gray-800 hover:border-red-500/30 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all flex items-center justify-center bg-transparent border-none"
                                                                                                    title="View Report"
                                                                                                >
                                                                                                    <Eye size={16} />
                                                                                                </button>
                                                                                            )}
                                                                                        </div>
                                                                                    ) : (
                                                                                        <div className="flex items-center gap-2">
                                                                                            <span className="text-[10px] font-bold text-red-500 bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded-xl flex items-center gap-1">
                                                                                                <Clock size={12} /> Pending
                                                                                            </span>
                                                                                            {isCentral && (
                                                                                                <button
                                                                                                    onClick={() => {
                                                                                                        setViewingReport({
                                                                                                            eventTitle: event.title,
                                                                                                            reportContent: null,
                                                                                                            university: uni,
                                                                                                            date: event.date.split('T')[0],
                                                                                                            eventRaw: event,
                                                                                                            eventType: event.type
                                                                                                        });
                                                                                                        setIsViewReportModalOpen(true);
                                                                                                    }}
                                                                                                    className="p-2 bg-[#1c2128] border border-gray-800 hover:border-red-500/30 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all flex items-center justify-center bg-transparent border-none"
                                                                                                    title="View Status"
                                                                                                >
                                                                                                    <Eye size={16} />
                                                                                                </button>
                                                                                            )}
                                                                                        </div>
                                                                                    )}

                                                                                    {!isReportSubmitted && !isCentral && (
                                                                                        <button
                                                                                            onClick={() => {
                                                                                                setSelectedEventForReport({ ...event, groupUni: uni });
                                                                                                setIsReportModalOpen(true);
                                                                                            }}
                                                                                            className="bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all"
                                                                                        >
                                                                                            Submit Report
                                                                                        </button>
                                                                                    )}
                                                                                </div>
                                                                            </div>

                                                                        </div>
                                                                    );
                                                                })
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })
                                    })()}
                                </div>
                            </div>
                        </div>
                    ) : activeTab === "University" ? (
                        <div className="flex-1 p-4 sm:p-8 overflow-y-auto flex flex-col gap-6">
                            {/* University Header / Select Tabs */}
                            <div>
                                <h2 className="text-xl sm:text-3xl font-black mb-4 flex items-center gap-2">
                                    <span className="text-red-500">
                                        <GraduationCap size={24} />
                                    </span>
                                    University Portals
                                </h2>
                                <p className="text-sm text-gray-500">Track and filter day-wise activities, circulars, and events per university campus.</p>
                            </div>

                            {/* University Selection Tabs */}
                            <div className="flex items-center gap-2 border-b border-gray-800 pb-px overflow-x-auto scrollbar-none shrink-0">
                                {isCentral ? (
                                    ["All Universities", "VGU", "SGU", "ADYPU"].map(uni => (
                                        <button
                                            key={uni}
                                            onClick={() => setSelectedUniTab(uni)}
                                            className={`px-6 py-3 font-semibold text-sm border-b-2 bg-transparent border-t-0 border-x-0 transition-all shrink-0 ${
                                                selectedUniTab === uni 
                                                    ? "border-red-600 text-white bg-red-600/5" 
                                                    : "border-transparent text-gray-500 hover:text-gray-300"
                                            }`}
                                        >
                                            {uni}
                                        </button>
                                    ))
                                ) : (
                                    <button className="px-6 py-3 font-semibold text-sm border-b-2 border-red-600 text-white bg-red-600/5 cursor-default border-t-0 border-x-0">
                                        {user.university} (Locked)
                                    </button>
                                )}
                            </div>

                            {/* University Detail View */}
                            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
                                {/* Left Side: Details & Stats Card */}
                                <div className="bg-[#161b22]/50 border border-gray-800 rounded-3xl p-6 flex flex-col gap-6">
                                    <div className="w-full h-32 rounded-2xl bg-gradient-to-br from-red-700/20 to-amber-600/20 flex items-center justify-center relative overflow-hidden border border-red-500/10">
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-red-600/10 rounded-full blur-2xl" />
                                        <GraduationCap size={48} className="relative z-10 animate-pulse text-red-500" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-100">{selectedUniTab}</h3>
                                        <p className="text-xs text-gray-500 mt-1 capitalize">Operational Campus Portal</p>
                                    </div>

                                    {/* Stats List */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-[#1c2128] border border-gray-800 p-4 rounded-2xl">
                                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Total Events</p>
                                            <p className="text-2xl font-black text-white">
                                                {(() => {
                                                    const uniqueEvents = Object.values(events)
                                                        .flat()
                                                        .filter((event, index, self) => 
                                                            self.findIndex(e => e.id === event.id) === index
                                                        );
                                                     if (isCentral) {
                                                         return uniqueEvents.filter(e => e.university === selectedUniTab || (selectedUniTab === "All Universities" && (e.university === "All Universities" || ["VGU", "SGU", "ADYPU"].includes(e.university)))).length;
                                                     }
                                                     return uniqueEvents.filter(e => e.university?.toLowerCase() === user?.university?.toLowerCase()).length;
                                                 })()}
                                             </p>
                                         </div>
                                         <div className="bg-[#1c2128] border border-gray-800 p-4 rounded-2xl">
                                             <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Status</p>
                                             <p className="text-xs font-semibold text-green-500 bg-green-500/10 border border-green-500/20 rounded px-2 py-0.5 w-fit mt-1">Active</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side: Event Timeline & Filtering */}
                                <div className="xl:col-span-2 flex flex-col gap-6">
                                    {/* Event Type Filter Sub-Tabs */}
                                    <div className="flex items-center gap-1.5 bg-gray-800/40 p-1 rounded-2xl w-fit overflow-x-auto max-w-full">
                                        {["All", "Circular", "Co-Circular", "Extra-Circular", "Cultural Activities", "Other"].map(type => (
                                            <button
                                                key={type}
                                                onClick={() => setSelectedUniTypeFilter(type)}
                                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all bg-transparent border-none shrink-0 ${
                                                    selectedUniTypeFilter === type 
                                                        ? "bg-red-600 text-white shadow-lg" 
                                                        : "text-gray-400 hover:text-white hover:bg-white/5"
                                                }`}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Timeline Event List */}
                                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                        {(() => {
                                            const uniEvents = Object.values(events)
                                                .flat()
                                                .filter((event, index, self) => 
                                                    self.findIndex(e => e.id === event.id) === index
                                                )
                                                .filter(event => {
                                                    if (isCentral) {
                                                        return selectedUniTab === "All Universities" || event.university === selectedUniTab;
                                                    }
                                                    return event.university?.toLowerCase() === user?.university?.toLowerCase();
                                                })
                                                .filter(event => selectedUniTypeFilter === "All" || event.type === selectedUniTypeFilter)
                                                .sort((a, b) => new Date(a.date) - new Date(b.date));

                                            if (uniEvents.length === 0) {
                                                return (
                                                    <div className="h-48 flex flex-col items-center justify-center border-2 border-dashed border-gray-800 rounded-3xl text-gray-700">
                                                        <Activity className="mb-2 opacity-10" size={32} />
                                                        <p className="text-xs uppercase font-bold tracking-widest text-gray-600">No matching schedules</p>
                                                    </div>
                                                );
                                            }

                                            return uniEvents.map(event => {
                                                const colors = getColorClasses(getCampusColor(event.university));
                                                return (
                                                    <motion.div 
                                                        initial={{ opacity: 0, y: 10 }} 
                                                        animate={{ opacity: 1, y: 0 }} 
                                                        key={event.id} 
                                                        className="bg-[#1c2128] p-5 rounded-2xl border border-gray-800 relative group flex items-start gap-4"
                                                    >
                                                        {/* Color Indicator */}
                                                        <div className={`w-1.5 h-12 rounded-full ${colors.border.replace('border-', 'bg-')} shrink-0 mt-1`} />
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${colors.bg} ${colors.text} border ${colors.borderLight} w-fit`}>
                                                                    {event.type}
                                                                </span>
                                                                <span className="text-[10px] text-gray-500 font-semibold flex items-center gap-1">
                                                                    <Clock size={11} />
                                                                    {event.date.split('T')[0]} {event.end_date && event.end_date !== event.date ? `to ${event.end_date.split('T')[0]}` : ''}
                                                                </span>
                                                            </div>
                                                            <h4 className="font-bold text-gray-100 uppercase tracking-tight text-base">{event.title}</h4>
                                                        </div>
                                                        
                                                        {/* Action to delete */}
                                                        {(isCentral || event.university?.toLowerCase() === user?.university?.toLowerCase()) && (
                                                            <button 
                                                                onClick={(e) => { e.stopPropagation(); handleDeleteEvent(event.id); }} 
                                                                className="text-gray-600 hover:text-red-500 transition-colors self-center p-2 rounded-lg hover:bg-red-500/10 opacity-100 xl:opacity-0 xl:group-hover:opacity-100 bg-transparent border-none"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        )}
                                                    </motion.div>
                                                );
                                            });
                                        })()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Calendar Area */}
                            <div className="flex-1 p-4 sm:p-8 overflow-y-auto">
                                <div className="flex items-center justify-between mb-6 sm:mb-8">
                                    <h2 className="text-xl sm:text-3xl font-bold">{months[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
                                    <div className="flex items-center bg-gray-800/50 rounded-xl p-1">
                                        <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))} className="p-2 bg-transparent border-none hover:bg-black/10 dark:hover:bg-white/10 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-lg transition-colors"><ChevronLeft size={20} /></button>
                                        <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))} className="p-2 bg-transparent border-none hover:bg-black/10 dark:hover:bg-white/10 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-lg transition-colors"><ChevronRight size={20} /></button>
                                    </div>
                                </div>

                                {/* Calendar Filters */}
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6 sm:mb-8 bg-[#1c2128]/50 p-4 rounded-xl border border-gray-800 backdrop-blur-sm">
                                    {isCentral && (
                                        <div className="flex items-center gap-2">
                                            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">University</label>
                                            <select 
                                                value={calendarUniFilter} 
                                                onChange={(e) => setCalendarUniFilter(e.target.value)} 
                                                className="bg-[#161b22] border border-gray-700 text-gray-300 text-xs rounded-lg px-2 py-1 outline-none focus:border-red-500 transition-colors"
                                            >
                                                <option value="All Universities">All Universities</option>
                                                <option value="VGU">VGU</option>
                                                <option value="SGU">SGU</option>
                                                <option value="ADYPU">ADYPU</option>
                                            </select>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Event Type</label>
                                        <select 
                                            value={calendarTypeFilter} 
                                            onChange={(e) => setCalendarTypeFilter(e.target.value)} 
                                            className="bg-[#161b22] border border-gray-700 text-gray-300 text-xs rounded-lg px-2 py-1 outline-none focus:border-red-500 transition-colors"
                                        >
                                            <option value="All">All Types</option>
                                            <option value="Circular">Circular</option>
                                            <option value="Co-Circular">Co-Circular</option>
                                            <option value="Extra-Circular">Extra-Circular</option>
                                            <option value="Cultural Activities">Cultural Activities</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Stats Counter Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 sm:mb-8">
                            <div className="bg-[#1c2128]/50 border border-gray-800 p-5 rounded-2xl flex items-center justify-between backdrop-blur-md transition-all hover:border-red-500/30">
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Total Events</p>
                                            <p className="text-2xl font-black text-white">
                                                {(() => {
                                                    const year = currentDate.getFullYear();
                                                    const monthVal = currentDate.getMonth();
                                                    const monthStartStr = `${year}-${String(monthVal + 1).padStart(2, '0')}-01`;
                                                    const daysInMonth = new Date(year, monthVal + 1, 0).getDate();
                                                    const monthEndStr = `${year}-${String(monthVal + 1).padStart(2, '0')}-${String(daysInMonth).padStart(2, '0')}`;

                                                    const uniqueEvents = Object.values(events)
                                                        .flat()
                                                        .filter((event, index, self) => 
                                                            self.findIndex(e => e.id === event.id) === index
                                                        )
                                                        .filter(e => {
                                                            const start = e.date.split('T')[0];
                                                            const end = (e.end_date || e.date).split('T')[0];
                                                            return start <= monthEndStr && end >= monthStartStr;
                                                        });

                                                    if (isCentral) {
                                                        return uniqueEvents.length;
                                                    }
                                                    return uniqueEvents.filter(e => e.university?.toLowerCase() === user?.university?.toLowerCase() || e.university === "All Universities").length;
                                                })()}
                                            </p>
                                        </div>
                                        <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
                                            <CalendarIcon size={20} />
                                        </div>
                                    </div>

                                    <div className="bg-[#1c2128]/50 border border-gray-800 p-5 rounded-2xl flex items-center justify-between backdrop-blur-md transition-all hover:border-red-500/30">
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Events So Far</p>
                                            <p className="text-2xl font-black text-white">
                                                {(() => {
                                                    const year = currentDate.getFullYear();
                                                    const monthVal = currentDate.getMonth();
                                                    const monthStartStr = `${year}-${String(monthVal + 1).padStart(2, '0')}-01`;
                                                    const daysInMonth = new Date(year, monthVal + 1, 0).getDate();
                                                    const monthEndStr = `${year}-${String(monthVal + 1).padStart(2, '0')}-${String(daysInMonth).padStart(2, '0')}`;
                                                    const todayStr = getLocalDateStr(new Date());

                                                    const uniqueEvents = Object.values(events)
                                                        .flat()
                                                        .filter((event, index, self) => 
                                                            self.findIndex(e => e.id === event.id) === index
                                                        )
                                                        .filter(e => {
                                                            const start = e.date.split('T')[0];
                                                            const end = (e.end_date || e.date).split('T')[0];
                                                            return start <= monthEndStr && end >= monthStartStr;
                                                        });

                                                    if (isCentral) {
                                                        return uniqueEvents.filter(e => e.date.split('T')[0] <= todayStr).length;
                                                    }
                                                    const filtered = uniqueEvents.filter(e => e.university?.toLowerCase() === user?.university?.toLowerCase() || e.university === "All Universities");
                                                    return filtered.filter(e => e.date.split('T')[0] <= todayStr).length;
                                                })()}
                                            </p>
                                        </div>
                                        <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-500">
                                            <CheckCircle2 size={20} />
                                        </div>
                                    </div>

                                    <div className="bg-[#1c2128]/50 border border-gray-800 p-5 rounded-2xl flex items-center justify-between backdrop-blur-md transition-all hover:border-red-500/30">
                                        <div>
                                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Today's Events</p>
                                            <p className="text-2xl font-black text-white">
                                                {(() => {
                                                    const todayStr = getLocalDateStr(new Date());

                                                    const uniqueEvents = Object.values(events)
                                                        .flat()
                                                        .filter((event, index, self) => 
                                                            self.findIndex(e => e.id === event.id) === index
                                                        );

                                                    if (isCentral) {
                                                        return uniqueEvents.filter(e => {
                                                            const start = e.date.split('T')[0];
                                                            const end = (e.end_date || e.date).split('T')[0];
                                                            return todayStr >= start && todayStr <= end;
                                                        }).length;
                                                    }
                                                    const filtered = uniqueEvents.filter(e => e.university?.toLowerCase() === user?.university?.toLowerCase() || e.university === "All Universities");
                                                    return filtered.filter(e => {
                                                        const start = e.date.split('T')[0];
                                                        const end = (e.end_date || e.date).split('T')[0];
                                                        return todayStr >= start && todayStr <= end;
                                                    }).length;
                                                })()}
                                            </p>
                                        </div>
                                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
                                            <Clock size={20} />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-7 gap-px bg-gray-800 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
                                    {days.map(day => (
                                        <div key={day} className="bg-[#161b22] p-2 sm:p-4 text-center text-[10px] sm:text-sm font-semibold text-gray-500 uppercase tracking-wider">
                                            {day}
                                        </div>
                                    ))}
                                    {calendarDays.map((day, idx) => {
                                        const dateStr = getDateString(day);
                                        const isSelected = dateStr === selectedDateString;
                                        const isToday = day === new Date().getDate() && currentDate.getMonth() === new Date().getMonth();
                                        const dayEvents = filterEvents(events[dateStr]);

                                        return (
                                            <div 
                                                key={idx} 
                                                onClick={() => handleDateClick(day)} 
                                                className={`bg-[#1c2128] min-h-[70px] sm:min-h-[110px] p-1 sm:p-2 transition-all cursor-pointer border-t border-gray-800 flex flex-col hover:bg-white/5 ${
                                                    isSelected ? 'ring-2 ring-inset ring-red-600/50 bg-red-600/5' : ''
                                                }`}
                                            >
                                                {day && (
                                                    <>
                                                        <div className="flex justify-start mb-1 sm:mb-2">
                                                            <span className={`w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded-full text-[10px] sm:text-xs font-bold ${
                                                                isToday ? 'bg-red-600 text-white' : isSelected ? 'bg-white/10 text-white' : 'text-gray-500'
                                                            }`}>{day}</span>
                                                        </div>
                                                        <div className="space-y-1">
                                                            {dayEvents.slice(0, 3).map(event => {
                                                                const colors = getColorClasses(getCampusColor(event.university));
                                                                return (
                                                                    <div key={event.id} className={`${colors.bg} border-l-2 ${colors.border} px-1 sm:px-1.5 py-0.5 rounded`}>
                                                                        <p className="text-[8px] sm:text-[10px] font-medium truncate text-gray-200">{event.title}</p>
                                                                    </div>
                                                                );
                                                            })}
                                                            {dayEvents.length > 3 && (
                                                                <p className="text-[7px] sm:text-[9px] text-gray-600 font-bold pl-1">
                                                                    +{dayEvents.length - 3} more
                                                                </p>
                                                            )}
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Details Panel */}
                            <div className="w-full xl:w-96 border-t xl:border-t-0 xl:border-l border-gray-800 bg-[#161b22]/30 p-4 sm:p-8 flex flex-col gap-6 sm:gap-8 shrink-0">
                                <div>
                                    <h3 className="text-base sm:text-lg font-bold mb-1">Schedule Details</h3>
                                    <p className="text-xs sm:text-sm text-gray-500">{selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                                </div>
                                <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar max-h-[350px] xl:max-h-none">
                                    {selectedDayEvents.length > 0 ? selectedDayEvents.map(event => (
                                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} key={event.id} className="bg-[#1c2128] p-4 sm:p-5 rounded-2xl border border-gray-800 relative group">
                                            {(isCentral || event.university?.toLowerCase() === user?.university?.toLowerCase()) && (
                                                <button onClick={(e) => { e.stopPropagation(); handleDeleteEvent(event.id); }} className="absolute top-4 right-4 text-gray-600 hover:text-red-500 transition-colors opacity-100 xl:opacity-0 xl:group-hover:opacity-100 bg-transparent border-none"><Trash2 size={16} /></button>
                                            )}
                                            <div className="flex flex-col gap-3">
                                                {(() => {
                                                    const colors = getColorClasses(getCampusColor(event.university));
                                                    return (
                                                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${colors.bg} ${colors.text} border ${colors.borderLight} w-fit`}>
                                                            {event.type}
                                                        </span>
                                                    );
                                                })()}
                                                <div>
                                                    <h4 className="font-bold text-gray-100 uppercase tracking-tight leading-tight text-sm sm:text-base">{event.title}</h4>
                                                    <div className="flex items-center gap-1 mt-1 text-gray-500 text-xs"><GraduationCap size={12} /><span>{event.university}</span></div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )) : (
                                        <div className="h-32 sm:h-48 flex flex-col items-center justify-center border-2 border-dashed border-gray-800 rounded-3xl text-gray-700">
                                            <Plus size={32} className="mb-2 opacity-10" /><p className="text-xs uppercase font-bold tracking-widest text-gray-600">No Events</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>

            <AnimatePresence>
                {isEventModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsEventModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.9, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.9, y: 20, opacity: 0 }} className="relative z-10 bg-[#161b22] border border-gray-800 w-full max-w-lg rounded-[2.5rem] p-6 sm:p-10 shadow-2xl">
                            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">New Event</h3>
                            <div className="space-y-6 mt-6 sm:mt-8">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 uppercase mb-2 block tracking-widest">Event Title</label>
                                    <input autoFocus placeholder="Enter event title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="w-full bg-[#1c2128] border border-gray-800 rounded-2xl p-4 text-white outline-none focus:border-red-600 text-sm sm:text-base" />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-500 uppercase mb-2 block tracking-widest">Start Date</label>
                                        <CustomDatePicker value={newEventDate} onChange={setNewEventDate} />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-500 uppercase mb-2 block tracking-widest">End Date</label>
                                        <CustomDatePicker value={newEventEndDate} onChange={setNewEventEndDate} />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 uppercase mb-2 block tracking-widest">Type</label>
                                    <CustomSelect 
                                        value={newType} 
                                        onChange={setNewType} 
                                        options={["Circular", "Co-Circular", "Extra-Circular", "Cultural Activities", "Other"]} 
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 uppercase mb-2 block tracking-widest">University</label>
                                    <CustomSelect 
                                        value={newUniversity} 
                                        onChange={setNewUniversity} 
                                        options={isCentral ? ["All Universities", "VGU", "SGU", "ADYPU"] : [user.university]} 
                                    />
                                </div>
                                <button onClick={handleAddEvent} className="w-full bg-red-600 py-4 sm:py-5 rounded-2xl font-bold text-white hover:bg-red-700 shadow-xl shadow-red-600/20 flex items-center justify-center gap-2 text-sm sm:text-base"><CheckCircle2 size={20} />Save Schedule</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isReportModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsReportModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.9, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.9, y: 20, opacity: 0 }} className="relative z-10 bg-[#161b22] border border-gray-800 w-full max-w-lg rounded-[2.5rem] p-6 sm:p-10 shadow-2xl">
                            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">Submit Event Report</h3>
                            <p className="text-xs text-gray-500 uppercase font-semibold tracking-wider mb-6">Event: {selectedEventForReport?.title}</p>
                            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-500 uppercase mb-2 block tracking-widest">Students Registered</label>
                                        <input 
                                            type="number"
                                            min="0"
                                            placeholder="Registered count" 
                                            value={reportStudentsRegisteredCount} 
                                            onChange={(e) => setReportStudentsRegisteredCount(e.target.value)} 
                                            className="w-full bg-[#1c2128] border border-gray-800 rounded-2xl p-4 text-white outline-none focus:border-red-600 text-sm font-sans" 
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-500 uppercase mb-2 block tracking-widest">Students Attended</label>
                                        <input 
                                            type="number"
                                            min="0"
                                            placeholder="Attended count" 
                                            value={reportStudentsAttendedCount} 
                                            onChange={(e) => setReportStudentsAttendedCount(e.target.value)} 
                                            className="w-full bg-[#1c2128] border border-gray-800 rounded-2xl p-4 text-white outline-none focus:border-red-600 text-sm font-sans" 
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 uppercase mb-2 block tracking-widest">Event Description</label>
                                    <textarea 
                                        rows={3}
                                        placeholder="Enter a detailed description of the event..." 
                                        value={reportDescriptionText} 
                                        onChange={(e) => setReportDescriptionText(e.target.value)} 
                                        className="w-full bg-[#1c2128] border border-gray-800 rounded-2xl p-4 text-white outline-none focus:border-red-600 text-sm font-sans resize-none" 
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 uppercase mb-2 block tracking-widest">Highlights of the Event</label>
                                    <textarea 
                                        rows={3}
                                        placeholder="What were the key achievements or outstanding highlights of this event?" 
                                        value={reportHighlightsText} 
                                        onChange={(e) => setReportHighlightsText(e.target.value)} 
                                        className="w-full bg-[#1c2128] border border-gray-800 rounded-2xl p-4 text-white outline-none focus:border-red-600 text-sm font-sans resize-none" 
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 uppercase mb-2 block tracking-widest">Feedback</label>
                                    <textarea 
                                        rows={3}
                                        placeholder="What was the overall feedback from participants?" 
                                        value={reportFeedbackText} 
                                        onChange={(e) => setReportFeedbackText(e.target.value)} 
                                        className="w-full bg-[#1c2128] border border-gray-800 rounded-2xl p-4 text-white outline-none focus:border-red-600 text-sm font-sans resize-none" 
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 uppercase mb-2 block tracking-widest">Feedback Summary</label>
                                    <textarea 
                                        rows={3}
                                        placeholder="Enter feedback summary / outcomes" 
                                        value={reportFeedbackSummaryText} 
                                        onChange={(e) => setReportFeedbackSummaryText(e.target.value)} 
                                        className="w-full bg-[#1c2128] border border-gray-800 rounded-2xl p-4 text-white outline-none focus:border-red-600 text-sm font-sans resize-none" 
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 uppercase mb-2 block tracking-widest">Photos/Drive Link</label>
                                    <input 
                                        type="text"
                                        placeholder="Enter Google Drive or photos URL..." 
                                        value={reportDriveLinkText} 
                                        onChange={(e) => setReportDriveLinkText(e.target.value)} 
                                        className="w-full bg-[#1c2128] border border-gray-800 rounded-2xl p-4 text-white outline-none focus:border-red-600 text-sm font-sans" 
                                    />
                                </div>
                                <button onClick={handleSubmittingReport} className="w-full bg-red-600 py-4 sm:py-5 rounded-2xl font-bold text-white hover:bg-red-700 shadow-xl shadow-red-600/20 flex items-center justify-center gap-2 text-sm sm:text-base mt-2"><CheckCircle2 size={20} />Submit Report</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isViewReportModalOpen && viewingReport && isCentral && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsViewReportModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.9, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.9, y: 20, opacity: 0 }} className="relative z-10 bg-[#161b22] border border-gray-800 w-full max-w-lg rounded-[2.5rem] p-6 sm:p-10 shadow-2xl">
                            <button onClick={() => setIsViewReportModalOpen(false)} className="absolute top-6 right-6 p-2 text-gray-400 hover:text-white rounded-full bg-[#1c2128] border border-gray-800/80 transition-colors">
                                <X size={18} />
                            </button>
                            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">View Event Report</h3>
                            <div className="space-y-4 mt-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Event Name</span>
                                        <p className="text-white font-semibold text-sm truncate">{viewingReport.eventTitle}</p>
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Event Type</span>
                                        <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-gray-800 text-gray-300 border border-gray-700 inline-block mt-0.5">
                                            {viewingReport.eventType || "N/A"}
                                        </span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Campus</span>
                                        <p className="text-red-500 font-bold text-xs uppercase tracking-wider">{viewingReport.university}</p>
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Date of Event</span>
                                        <p className="text-gray-300 font-medium text-xs">{viewingReport.date}</p>
                                    </div>
                                </div>
                                <div className="border-t border-gray-800/80 pt-4">
                                    {viewingReport.reportContent ? (() => {
                                        let details = { feedback: "", feedbackSummary: "", highlights: "", studentsRegistered: "", studentsCount: "", description: "", driveLink: "" };
                                        try {
                                            const parsed = JSON.parse(viewingReport.reportContent);
                                            if (parsed && typeof parsed === "object") {
                                                details = {
                                                    feedback: parsed.feedback || "",
                                                    feedbackSummary: parsed.feedbackSummary || "",
                                                    studentsRegistered: parsed.studentsRegistered || "",
                                                    studentsCount: parsed.studentsCount || parsed.studentsAttended || "",
                                                    highlights: parsed.highlights || "",
                                                    description: parsed.description || parsed.highlights || "",
                                                    driveLink: parsed.driveLink || ""
                                                };
                                            } else {
                                                details = {
                                                    feedback: viewingReport.reportContent,
                                                    feedbackSummary: "N/A",
                                                    studentsRegistered: "N/A",
                                                    studentsCount: "N/A",
                                                    highlights: "N/A",
                                                    description: viewingReport.reportContent || "N/A",
                                                    driveLink: "N/A"
                                                };
                                            }
                                        } catch (e) {
                                            details = {
                                                feedback: viewingReport.reportContent,
                                                feedbackSummary: "N/A",
                                                studentsRegistered: "N/A",
                                                studentsCount: "N/A",
                                                highlights: "N/A",
                                                description: viewingReport.reportContent || "N/A",
                                                driveLink: "N/A"
                                            };
                                        }

                                        return (
                                            <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Students Registered</span>
                                                        <p className="text-white font-bold text-base bg-[#1c2128] border border-gray-800 rounded-xl px-3.5 py-2 w-fit">
                                                            {details.studentsRegistered || "N/A"}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Students Attended</span>
                                                        <p className="text-white font-bold text-base bg-[#1c2128] border border-gray-800 rounded-xl px-3.5 py-2 w-fit">
                                                            {details.studentsCount || "N/A"}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div>
                                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">Event Description</span>
                                                    <div className="bg-[#1c2128] border border-gray-800 rounded-2xl p-4 max-h-[100px] overflow-y-auto custom-scrollbar">
                                                        <p className="text-xs sm:text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">{details.description || "N/A"}</p>
                                                    </div>
                                                </div>
                                                <div>
                                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">Highlights of the Event</span>
                                                    <div className="bg-[#1c2128] border border-gray-800 rounded-2xl p-4 max-h-[100px] overflow-y-auto custom-scrollbar">
                                                        <p className="text-xs sm:text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">{details.highlights || "N/A"}</p>
                                                    </div>
                                                </div>
                                                <div>
                                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">Feedback</span>
                                                    <div className="bg-[#1c2128] border border-gray-800 rounded-2xl p-4 max-h-[100px] overflow-y-auto custom-scrollbar">
                                                        <p className="text-xs sm:text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">{details.feedback || "N/A"}</p>
                                                    </div>
                                                </div>
                                                <div>
                                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">Feedback Summary</span>
                                                    <div className="bg-[#1c2128] border border-gray-800 rounded-2xl p-4 max-h-[100px] overflow-y-auto custom-scrollbar">
                                                        <p className="text-xs sm:text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">{details.feedbackSummary || "N/A"}</p>
                                                    </div>
                                                </div>
                                                <div>
                                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">Photos/Drive Link</span>
                                                    <div className="bg-[#1c2128] border border-gray-800 rounded-2xl p-4 flex items-center justify-between">
                                                        {details.driveLink && details.driveLink !== "N/A" ? (
                                                            <a 
                                                                href={details.driveLink.startsWith("http") ? details.driveLink : `https://${details.driveLink}`} 
                                                                target="_blank" 
                                                                rel="noopener noreferrer"
                                                                className="text-xs sm:text-sm text-amber-500 hover:text-amber-400 font-bold hover:underline truncate mr-2"
                                                            >
                                                                {details.driveLink}
                                                            </a>
                                                        ) : (
                                                            <span className="text-xs sm:text-sm text-gray-500">No link provided</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })() : (
                                        <div className="bg-[#1c2128]/30 border border-gray-800 border-dashed rounded-2xl p-6 text-center">
                                            <Clock className="text-red-500 mx-auto mb-2 animate-pulse" size={24} />
                                            <p className="text-xs text-gray-500 font-medium">No execution report has been submitted for this event yet.</p>
                                            
                                            {!isCentral && (
                                                <button
                                                    onClick={() => {
                                                        setIsViewReportModalOpen(false);
                                                        setSelectedEventForReport(viewingReport.eventRaw);
                                                        setIsReportModalOpen(true);
                                                    }}
                                                    className="mt-4 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all inline-flex items-center gap-1.5 shadow-lg shadow-red-600/10"
                                                >
                                                    <Plus size={14} /> Submit Report Now
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
