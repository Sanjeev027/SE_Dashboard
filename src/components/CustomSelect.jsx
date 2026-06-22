import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

export const CustomSelect = ({ value, onChange, options, placeholder = "Select Option", className = "", padding = "p-4", textSize = "text-sm sm:text-base", dropdownPadding = "py-3 px-4", dropdownTextSize = "text-sm sm:text-base", disabled = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (selectRef.current && !selectRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div ref={selectRef} className={`relative w-full ${className}`}>
            <div 
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={`w-full bg-card border border-border-card rounded-[14px] h-[44px] px-4 flex justify-between items-center text-gray-300 outline-none transition-colors ${textSize} select-none ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-primary/50 focus:border-primary"}`}
            >
                <span className="capitalize truncate pr-2">{value || placeholder}</span>
                <ChevronDown size={18} className={`shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180 text-primary" : "text-muted"}`} />
            </div>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute z-50 w-full mt-2 bg-card border border-border-card rounded-2xl overflow-y-auto max-h-60 shadow-2xl py-2 custom-scrollbar"
                    >
                        {options.map((opt) => {
                            const optValue = typeof opt === 'object' ? opt.value : opt;
                            const optLabel = typeof opt === 'object' ? opt.label : opt;
                            const currentLabel = options.find(o => (typeof o === 'object' ? o.value : o) === value);
                            const displayValue = typeof currentLabel === 'object' ? currentLabel.label : currentLabel;
                            
                            return (
                                <div
                                    key={optValue}
                                    onClick={() => { onChange(optValue); setIsOpen(false); }}
                                    className={`${dropdownPadding} ${dropdownTextSize} cursor-pointer transition-all hover:bg-primary/10 hover:text-primary flex items-center select-none ${value === optValue ? "bg-primary/10 text-primary font-medium border-l-2 border-primary" : "text-gray-300 border-l-2 border-transparent"}`}
                                >
                                    {optLabel}
                                </div>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
