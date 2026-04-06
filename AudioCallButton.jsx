import React, { useState, useRef, useEffect, memo } from 'react';
import { Mic, X, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const AudioCallButton = ({ className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 md:bottom-24 md:right-6 z-[999] bg-[#E0A995] text-[#0A1612] hover:bg-[#D49A89] w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-110 active:scale-95 ${className}`}
        aria-label="Start Voice Call"
      >
        <Mic className="w-6 h-6" />
      </motion.button>

      {isOpen && (
        <div className="fixed inset-0 z-[1001] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#0A1612] border border-[#E0A995]/20 w-full max-w-sm h-[400px] rounded-xl overflow-hidden flex flex-col relative">
            <div className="flex items-center justify-between p-4 border-b border-[#E0A995]/10 bg-[#13251E]">
              <div className="flex items-center gap-2 text-[#EBE8E3]">
                <Sparkles className="w-4 h-4 text-[#E0A995]" />
                <span className="font-serif font-bold text-sm">Voice Concierge</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-[#A8B3AF] hover:text-[#E0A995]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
               <Mic className="w-16 h-16 text-[#E0A995] mb-4 animate-pulse" />
               <p className="text-[#A8B3AF] text-sm">Voice connection is currently disabled in this environment.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AudioCallButton;