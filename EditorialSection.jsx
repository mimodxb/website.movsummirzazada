import React from 'react';
import { motion } from 'framer-motion';

const EditorialSection = ({ title, children, className }) => {
  return (
    <section className={`relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden ${className}`}>
      {/* Background with slight gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A1612] via-[#0F1C15] to-[#0A1612] pointer-events-none" />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        {title && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#EBE8E3] mb-4">
              {title}
            </h2>
            <div className="h-1 w-20 bg-[#E0A995] mx-auto rounded-full" />
          </motion.div>
        )}
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {children}
        </motion.div>
      </div>
    </section>
  );
};

export default EditorialSection;