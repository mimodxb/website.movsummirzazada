import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ShoppingCart from '@/components/ShoppingCart';
import GeminiAssistantWidget from '@/components/GeminiAssistantWidget';
import GoogleTranslateWidget from '@/components/GoogleTranslateWidget';
import AudioCallButton from '@/components/AudioCallButton';

const Layout = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div
      className="min-h-screen flex flex-col bg-transparent relative"
      style={{ width: '100%', maxWidth: '100vw', overflowX: 'hidden' }}
    >
      <Header onCartClick={() => setIsCartOpen(true)} />
      <ShoppingCart isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} />
      <GoogleTranslateWidget />

      <main
        className="flex-grow w-full relative z-10"
        style={{ overflowX: 'hidden' }}
      >
        <Outlet />
      </main>

      <Footer />

      <div className="fixed bottom-6 right-6 z-[999] flex flex-col gap-4 items-end pointer-events-none">
        <div className="pointer-events-auto">
          <AudioCallButton className="static !bottom-auto !right-auto" />
        </div>
        <div className="pointer-events-auto">
          <GeminiAssistantWidget />
        </div>
      </div>
    </div>
  );
};

export default Layout;