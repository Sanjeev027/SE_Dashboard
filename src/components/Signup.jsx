import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { Lock, User, Mail, UserPlus, AlertCircle, CheckCircle, Globe, GraduationCap } from "lucide-react";
import { API_URL } from "../config";

export default function Signup() {
  const navigate = useNavigate();

  const [loginId, setLoginId] = useState("");
  const [email, setEmail] = useState("");
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
    <div className="relative w-screen h-screen bg-app text-white flex items-center justify-center overflow-hidden font-sans p-4 sm:p-6">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative z-10 w-full max-w-md bg-card border border-border-card rounded-[20px] p-8 sm:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.25)] overflow-hidden"
      >
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 bg-app border border-border-card rounded-xl flex items-center justify-center shadow-lg shadow-primary/10 mb-3 text-primary">
            <GraduationCap size={24} />
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">Create Account</h2>
          <p className="text-xs text-muted mt-1 uppercase tracking-widest font-semibold">Join NEXUS_Hub</p>
        </div>

        {/* Notices */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2.5 bg-destructive/10 border border-destructive/20 p-4 rounded-xl text-destructive text-xs sm:text-sm mb-5 leading-tight"
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
              className="flex items-center gap-2.5 bg-green-500/10 border border-green-500/20 p-4 rounded-xl text-green-500 text-xs sm:text-sm mb-5 leading-tight"
            >
              <CheckCircle size={18} className="shrink-0" />
              <span>{success}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-4">
          {/* Login ID Input */}
          <div>
            <label className="text-[10px] font-bold text-muted uppercase tracking-widest block mb-1.5">Login ID / Username</label>
            <div className="flex items-center gap-3 bg-app border border-border-card focus-within:border-primary rounded-xl px-4 py-3 sm:py-3.5 transition-colors">
              <User size={18} className="text-muted shrink-0" />
              <input
                type="text"
                placeholder="Enter Login ID"
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                className="bg-transparent border-none outline-none text-white text-sm sm:text-base w-full placeholder-muted"
              />
            </div>
          </div>

          {/* Email Input */}
          <div>
            <label className="text-[10px] font-bold text-muted uppercase tracking-widest block mb-1.5">Email Address</label>
            <div className="flex items-center gap-3 bg-app border border-border-card focus-within:border-primary rounded-xl px-4 py-3 sm:py-3.5 transition-colors">
              <Mail size={18} className="text-muted shrink-0" />
              <input
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent border-none outline-none text-white text-sm sm:text-base w-full placeholder-muted"
              />
            </div>
          </div>



          {/* Password Input */}
          <div>
            <label className="text-[10px] font-bold text-muted uppercase tracking-widest block mb-1.5">Password</label>
            <div className="flex items-center gap-3 bg-app border border-border-card focus-within:border-primary rounded-xl px-4 py-3 sm:py-3.5 transition-colors">
              <Lock size={18} className="text-muted shrink-0" />
              <input
                type="password"
                placeholder="Create password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent border-none outline-none text-white text-sm sm:text-base w-full placeholder-muted"
              />
            </div>
          </div>

          {/* Confirm Password Input */}
          <div>
            <label className="text-[10px] font-bold text-muted uppercase tracking-widest block mb-1.5">Confirm Password</label>
            <div className="flex items-center gap-3 bg-app border border-border-card focus-within:border-primary rounded-xl px-4 py-3 sm:py-3.5 transition-colors">
              <Lock size={18} className="text-muted shrink-0" />
              <input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-transparent border-none outline-none text-white text-sm sm:text-base w-full placeholder-muted"
              />
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSignup}
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-hover py-3.5 sm:py-4 rounded-xl font-bold text-white shadow-lg shadow-primary/20 flex items-center justify-center gap-2 text-sm sm:text-base disabled:opacity-75 transition-colors mt-6"
          >
            <UserPlus size={18} />
            <span>{loading ? "Registering..." : "Create Account"}</span>
          </motion.button>
        </div>

        {/* Back Link */}
        <p className="text-center text-xs sm:text-sm text-muted mt-6 border-t border-border-card pt-5">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:text-primary-hover font-semibold transition-colors">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
