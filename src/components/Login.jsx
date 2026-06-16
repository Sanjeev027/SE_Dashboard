import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { Lock, LogIn, User, AlertCircle, Sun, Moon } from "lucide-react";
import logoImg from "../assets/niat.jpg";
import { API_URL } from "../config";

export default function Login() {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved === "light" ? false : true;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.setAttribute("data-theme", "light");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!loginId.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const res = await axios.post(`${API_URL}/api/auth/login`, {
        loginId: loginId.trim(),
        password: password.trim(),
      });

      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/home"); 
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-screen h-screen bg-[#08090c] text-white flex items-center justify-center overflow-hidden font-sans p-4 sm:p-6">
      {/* Theme Toggle Button */}
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50 p-3 bg-[#1c2128]/50 border border-gray-800 hover:border-gray-700 text-gray-400 hover:text-white rounded-2xl transition-all flex items-center justify-center shadow-lg"
        title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-red-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-amber-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md bg-[#121620]/40 backdrop-blur-2xl border border-gray-800 rounded-[2rem] p-8 sm:p-10 shadow-2xl overflow-hidden"
      >
        {/* Brand/Logo Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-[#161b22]/90 border border-gray-800 rounded-xl flex items-center justify-center shadow-lg shadow-red-600/10 mb-3 p-2">
            <img src={logoImg} alt="NIAT Logo" className="w-full h-full object-contain" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-gray-100">Portal Login</h2>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-semibold">Academia_HuB Control Center</p>
        </div>

        {/* Error Message Section */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2.5 bg-red-500/10 border border-red-500/25 p-4 rounded-2xl text-red-400 text-xs sm:text-sm mb-6 leading-tight"
            >
              <AlertCircle size={18} className="shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-5">
          {/* Login ID Input */}
          <div>
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-2">Login ID / Username</label>
            <div className="flex items-center gap-3 bg-[#1c2128]/50 border border-gray-800 focus-within:border-red-600/60 rounded-2xl px-4 py-3.5 sm:py-4 transition-all">
              <User size={18} className="text-gray-500 shrink-0" />
              <input
                type="text"
                placeholder="Enter Login ID"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                className="bg-transparent border-none outline-none text-white text-sm sm:text-base w-full placeholder-gray-600"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-2">Password</label>
            <div className="flex items-center gap-3 bg-[#1c2128]/50 border border-gray-800 focus-within:border-red-600/60 rounded-2xl px-4 py-3.5 sm:py-4 transition-all relative">
              <Lock size={18} className="text-gray-500 shrink-0" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent border-none outline-none text-white text-sm sm:text-base w-full pr-10 placeholder-gray-600"
              />
              <span
                className="absolute right-4 cursor-pointer text-gray-500 hover:text-gray-300 transition-colors text-sm sm:text-base"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-gradient-to-r from-red-700 to-amber-600 py-4 sm:py-4.5 rounded-2xl font-bold text-white hover:from-red-600 hover:to-amber-500 shadow-xl shadow-red-700/20 flex items-center justify-center gap-2 text-sm sm:text-base disabled:opacity-75 transition-all mt-6 transform hover:scale-[1.01]"
          >
            <LogIn size={18} />
            <span>{loading ? "Verifying..." : "Login"}</span>
          </button>
        </div>

        {/* Links */}
        <div className="flex items-center justify-between text-xs sm:text-sm mt-8 border-t border-gray-800/60 pt-6">
          <Link to="/forgot-password" className="text-gray-500 hover:text-amber-400 transition-colors">
            Forgot Password?
          </Link>
          <Link to="/signup" className="text-amber-500 hover:text-amber-400 font-semibold transition-colors">
            Register Account
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
