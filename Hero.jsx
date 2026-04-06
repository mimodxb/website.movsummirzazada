import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import LogoComponent from './LogoComponent';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative w-full z-10" style={{ minHeight: 'calc(100vh - 72px)' }}>
      <div className="w-full h-full flex flex-col lg:flex-row items-center justify-center" style={{ minHeight: 'calc(100vh - 72px)' }}>
        
        {/* Mobile Layout (Stacked) / Desktop Left (Actor) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full lg:w-1/2 flex flex-col items-center justify-center text-center px-6 py-12 lg:py-0 space-y-6"
        >
          <div className="relative flex-shrink-0" style={{ width: 'clamp(200px, 30vw, 360px)', height: 'clamp(200px, 30vw, 360px)' }}>
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#E0A995]/20 to-transparent blur-2xl" />
            <img
              className="relative w-full h-full rounded-full object-cover border-2 border-[#E0A995]/40 shadow-[0_0_30px_rgba(0,0,0,0.5)]"
              alt="Movsum Mirzazada portrait"
              src="https://horizons-cdn.hostinger.com/c7dad59a-68cf-4683-81b9-922e45c5685c/33e7c639afb549955711f5eb336b04fa.png"
              loading="eager"
            />
          </div>
          <div className="space-y-3 w-full max-w-lg">
            <h1 className="font-serif font-bold text-[#EBE8E3] leading-tight" style={{ fontSize: 'clamp(32px, 4vw, 56px)' }}>
              Movsum Mirzazada<br className="hidden md:block" />
              <span className="text-[#E0A995] italic lg:ml-3">'Mimo'</span>
            </h1>
            <p className="text-[#A8B3AF] font-light tracking-wide" style={{ fontSize: 'clamp(14px, 1.5vw, 18px)' }}>
              International Award-Winning Actor &amp; Creative Director
            </p>
          </div>
          <Button
            onClick={() => navigate('/media?tab=filmography')}
            variant="outline"
            size="lg"
            className="border-[#E0A995] text-[#EBE8E3] bg-transparent hover:bg-[#E0A995] hover:text-[#0A1612] transition-all duration-300 font-semibold tracking-widest uppercase px-8 py-6 rounded-md"
          >
            Explore Filmography
          </Button>
        </motion.div>

        {/* Mobile Layout (Stacked) / Desktop Right (Brand) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full lg:w-1/2 flex flex-col items-center justify-center text-center px-6 py-12 lg:py-0 space-y-6 border-t lg:border-t-0 lg:border-l border-[#E0A995]/10"
        >
          <div className="relative flex-shrink-0 flex items-center justify-center" style={{ width: 'clamp(180px, 25vw, 300px)', height: 'clamp(180px, 25vw, 300px)' }}>
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#E0A995]/10 to-transparent blur-2xl" />
            <div className="relative w-full h-full rounded-full flex items-center justify-center border border-[#E0A995]/30 bg-[#13251E]/60 p-8 shadow-[0_0_30px_rgba(0,0,0,0.5)] backdrop-blur-sm">
              <LogoComponent size="xl" className="w-full h-full object-contain" />
            </div>
          </div>
          <div className="space-y-3 w-full max-w-lg">
            <h2 className="font-serif font-bold text-[#EBE8E3] leading-tight" style={{ fontSize: 'clamp(28px, 3.5vw, 48px)' }}>
              Mimo's<br className="hidden md:block" />
              <span className="text-[#E0A995] lg:ml-3">Collective</span>
            </h2>
            <p className="text-[#A8B3AF] font-light tracking-wide" style={{ fontSize: 'clamp(14px, 1.5vw, 18px)' }}>
              Creative Entrepreneurship, Exclusive Services &amp; Offers
            </p>
          </div>
          <Button
            onClick={() => navigate('/mimo-collective')}
            variant="outline"
            size="lg"
            className="border-[#E0A995] text-[#EBE8E3] bg-transparent hover:bg-[#E0A995] hover:text-[#0A1612] transition-all duration-300 font-semibold tracking-widest uppercase px-8 py-6 rounded-md"
          >
            Explore The Brand
          </Button>
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;