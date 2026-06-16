import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { Lock, User, Mail, UserPlus, AlertCircle, CheckCircle, Globe, Sun, Moon } from "lucide-react";
import logoImg from "../assets/niat.jpg";
import { API_URL } from "../config";

export default function Signup() {
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
  const [email, setEmail] = useState("");
  const [university, setUniversity] = useState("VGU");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSignup = async () => {
    if (!loginId.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const res = await axios.post(`${API_URL}/api/auth/signup`, {
        loginId: loginId.trim(),
        email: email.trim(),
        password: password.trim(),
        university: university,
      });

      setSuccess(res.data.message || "Account created successfully!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
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

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md bg-[#121620]/40 backdrop-blur-2xl border border-gray-800 rounded-[2rem] p-8 sm:p-10 shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 bg-[#161b22]/90 border border-gray-800 rounded-xl flex items-center justify-center shadow-lg shadow-red-600/10 mb-3 p-2">
            <img src={logoImg} alt="NIAT Logo" className="w-full h-full object-contain" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-gray-100">Create Account</h2>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-semibold">Join Academia_HuB</p>
        </div>

        {/* Notices */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2.5 bg-red-500/10 border border-red-500/25 p-4 rounded-2xl text-red-400 text-xs sm:text-sm mb-5 leading-tight"
            >
              <AlertCircle size={18} className="shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2.5 bg-green-500/10 border border-green-500/25 p-4 rounded-2xl text-green-400 text-xs sm:text-sm mb-5 leading-tight"
            >
              <CheckCircle size={18} className="shrink-0" />
              <span>{success}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-4">
          {/* Login ID Input */}
          <div>
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">Login ID / Username</label>
            <div className="flex items-center gap-3 bg-[#1c2128]/50 border border-gray-800 focus-within:border-red-600/60 rounded-2xl px-4 py-3 sm:py-3.5 transition-all">
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

          {/* Email Input */}
          <div>
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">Email Address</label>
            <div className="flex items-center gap-3 bg-[#1c2128]/50 border border-gray-800 focus-within:border-red-600/60 rounded-2xl px-4 py-3 sm:py-3.5 transition-all">
              <Mail size={18} className="text-gray-500 shrink-0" />
              <input
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent border-none outline-none text-white text-sm sm:text-base w-full placeholder-gray-600"
              />
            </div>
          </div>

          {/* University Input */}
          <div>
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">University / Campus</label>
            <div className="flex items-center gap-3 bg-[#1c2128]/50 border border-gray-800 focus-within:border-red-600/60 rounded-2xl px-4 py-3 sm:py-3.5 transition-all">
              <Globe size={18} className="text-gray-500 shrink-0" />
              <select
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                className="bg-transparent border-none outline-none text-white text-sm sm:text-base w-full placeholder-gray-600 cursor-pointer bg-[#121620]"
              >
                <option value="VGU" className="bg-[#121620] text-white">VGU</option>
                <option value="sgu" className="bg-[#121620] text-white">sgu</option>
                <option value="adypu" className="bg-[#121620] text-white">adypu</option>
              </select>
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">Password</label>
            <div className="flex items-center gap-3 bg-[#1c2128]/50 border border-gray-800 focus-within:border-red-600/60 rounded-2xl px-4 py-3 sm:py-3.5 transition-all">
              <Lock size={18} className="text-gray-500 shrink-0" />
              <input
                type="password"
                placeholder="Create password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent border-none outline-none text-white text-sm sm:text-base w-full placeholder-gray-600"
              />
            </div>
          </div>

          {/* Confirm Password Input */}
          <div>
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">Confirm Password</label>
            <div className="flex items-center gap-3 bg-[#1c2128]/50 border border-gray-800 focus-within:border-red-600/60 rounded-2xl px-4 py-3 sm:py-3.5 transition-all">
              <Lock size={18} className="text-gray-500 shrink-0" />
              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-transparent border-none outline-none text-white text-sm sm:text-base w-full placeholder-gray-600"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSignup}
            disabled={loading}
            className="w-full bg-gradient-to-r from-red-700 to-amber-600 py-3.5 sm:py-4 rounded-2xl font-bold text-white hover:from-red-600 hover:to-amber-500 shadow-xl shadow-red-700/20 flex items-center justify-center gap-2 text-sm sm:text-base disabled:opacity-75 transition-all mt-6 transform hover:scale-[1.01]"
          >
            <UserPlus size={18} />
            <span>{loading ? "Registering..." : "Create Account"}</span>
          </button>
        </div>

        {/* Back Link */}
        <p className="text-center text-xs sm:text-sm text-gray-500 mt-6 border-t border-gray-800/60 pt-5">
          Already have an account?{" "}
          <Link to="/login" className="text-amber-500 hover:text-amber-400 font-semibold transition-colors">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
