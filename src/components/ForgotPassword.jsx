import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Key, User, ArrowLeft, CheckCircle, AlertCircle, GraduationCap } from "lucide-react";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [loginId, setLoginId] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const inputRefs = [useRef(), useRef(), useRef(), useRef()];

  const handleOtpChange = (value, index) => {
    const cleanValue = value.replace(/[^0-9]/g, "").slice(-1);
    const newOtp = [...otp];
    newOtp[index] = cleanValue;
    setOtp(newOtp);

    // Auto-focus next cell
    if (cleanValue !== "" && index < 3) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Backspace auto-focus previous cell
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  const handleReset = async () => {
    const otpCode = otp.join("");
    if (!loginId.trim() || otpCode.length < 4 || !password.trim() || !confirmPassword.trim()) {
      setError("Please fill in all fields including the 4-digit OTP");
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

      // Mock Reset - since backend typically requires specific integration, we show success and navigate
      setSuccess("Password has been reset successfully!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError("Failed to reset password. Please check your credentials.");
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
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">Reset Password</h2>
          <p className="text-xs text-muted mt-1 uppercase tracking-widest font-semibold">Account Recovery</p>
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

          {/* OTP Code Cells */}
          <div>
            <label className="text-[10px] font-bold text-muted uppercase tracking-widest block mb-1.5 text-center">Verification OTP</label>
            <div className="flex justify-center gap-3 py-1">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={inputRefs[index]}
                  type="text"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  value={digit}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onChange={(e) => handleOtpChange(e.target.value, index)}
                  className="w-12 h-12 text-center text-lg font-bold rounded-xl bg-app border border-border-card focus:border-primary text-white outline-none transition-colors"
                  maxLength={1}
                />
              ))}
            </div>
          </div>

          {/* New Password Input */}
          <div>
            <label className="text-[10px] font-bold text-muted uppercase tracking-widest block mb-1.5">New Password</label>
            <div className="flex items-center gap-3 bg-app border border-border-card focus-within:border-primary rounded-xl px-4 py-3 sm:py-3.5 transition-colors relative">
              <Lock size={18} className="text-muted shrink-0" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent border-none outline-none text-white text-sm sm:text-base w-full pr-10 placeholder-muted"
              />
              <span
                className="absolute right-4 cursor-pointer text-muted hover:text-white transition-colors text-sm sm:text-base"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>
          </div>

          {/* Confirm Password Input */}
          <div>
            <label className="text-[10px] font-bold text-muted uppercase tracking-widest block mb-1.5">Confirm New Password</label>
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
            onClick={handleReset}
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-hover py-3.5 sm:py-4 rounded-xl font-bold text-white shadow-lg shadow-primary/20 flex items-center justify-center gap-2 text-sm sm:text-base disabled:opacity-75 transition-colors mt-6"
          >
            <Key size={18} />
            <span>{loading ? "Resetting..." : "Reset Password"}</span>
          </motion.button>
        </div>

        {/* Back Link */}
        <p className="text-center text-xs sm:text-sm text-muted mt-6 border-t border-border-card pt-5 flex items-center justify-center gap-1.5">
          <ArrowLeft size={16} />
          <Link to="/login" className="text-primary hover:text-primary-hover font-semibold transition-colors">
            Back to Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
