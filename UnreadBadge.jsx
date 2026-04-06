import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const UnreadBadge = ({ count }) => {
  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-[#0A1612]"
        >
          {count > 9 ? '9+' : count}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default UnreadBadge;