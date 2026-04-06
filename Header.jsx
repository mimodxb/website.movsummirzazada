import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingCart, UserCheck, Mail, LogIn } from 'lucide-react';
import { Button } from './ui/button';
import LogoComponent from '@/components/LogoComponent';
import CurrencySelector from '@/components/CurrencySelector';
import LanguageSelector from '@/components/LanguageSelector';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { messagingService } from '@/lib/messagingService';
import UnreadBadge from './UnreadBadge';
import { useCart } from '@/hooks/useCart';

const Header = ({ onCartClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, userRole } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const totalCartItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (user) {
      messagingService
        .getUnreadCount(user.id, userRole === 'admin' ? 'admin' : 'client')
        .then(setUnreadCount)
        .catch(console.error);
    }
  }, [user, userRole]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const navLinks = [
    { name: 'Biography', path: '/about' },
    { name: 'Filmography', path: '/media?tab=filmography' },
    { name: 'Media', path: '/media' },
    { name: 'Press Kit', path: '/media?tab=press-kit' },
    { name: 'Contact', path: '/contact' },
    { name: 'Featured', path: '/mimo-collective/legal-complaint-service' },
    { name: 'Shop', path: '/mimo-collective/shop' },
    { name: 'Offers', path: '/mimo-collective/offers' },
    { name: 'Brands', path: '/brands' },
  ];

  const activeStyle = 'text-[#E0A995] border-b-2 border-[#E0A995]';
  const inactiveStyle = 'text-[#A8B3AF] hover:text-[#EBE8E3] border-b-2 border-transparent hover:border-[#E0A995]/50 transition-colors duration-200';

  return (
    <>
      <header
        className={`sticky top-0 z-[1000] w-full bg-[#0A1612]/95 backdrop-blur-xl border-b border-[#E0A995]/10 transition-shadow duration-300 ${
          isScrolled ? 'shadow-lg shadow-black/40' : ''
        }`}
        style={{ WebkitBackdropFilter: 'blur(20px)' }}
      >
        <div
          className="w-full flex items-center justify-between gap-2 px-4 sm:px-6 lg:px-8"
          style={{ height: '72px' }}
        >
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <NavLink to="/" onClick={() => setIsOpen(false)} aria-label="Home" className="flex items-center">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-[#E0A995] bg-[#0A1612] flex items-center justify-center overflow-hidden shadow-[0_0_8px_rgba(224,169,149,0.3)]">
                <LogoComponent size="sm" className="w-full h-full" />
              </div>
            </NavLink>
          </div>

          {/* Desktop Navigation */}
          <nav
            className="hidden lg:flex items-center gap-4 xl:gap-6 flex-1 mx-4 overflow-x-auto"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            aria-label="Main navigation"
          >
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `text-sm font-medium py-2 whitespace-nowrap flex-shrink-0 ${isActive ? activeStyle : inactiveStyle}`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Utilities Section */}
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
            <div className="hidden sm:block">
              <LanguageSelector />
            </div>
            <div className="hidden sm:block">
              <CurrencySelector />
            </div>

            {!user ? (
              <Button
                onClick={() => navigate('/auth')}
                variant="outline"
                size="sm"
                className="hidden md:flex items-center gap-2 min-h-[40px] border-[#E0A995] text-[#EBE8E3] hover:bg-[#E0A995] hover:text-[#0A1612] transition-all duration-300"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </Button>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Button
                  onClick={() => navigate('/client-messaging')}
                  variant="ghost"
                  size="icon"
                  className="relative h-10 w-10 hover:text-[#E0A995] transition-colors"
                  aria-label="Messages"
                >
                  <Mail className="w-5 h-5" />
                  <UnreadBadge count={unreadCount} />
                </Button>
                <Button
                  onClick={() => navigate('/admin')}
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 hover:text-[#E0A995] transition-colors"
                  aria-label="Admin dashboard"
                >
                  <UserCheck className="w-5 h-5" />
                </Button>
              </div>
            )}

            <Button
              onClick={onCartClick}
              variant="ghost"
              size="icon"
              className="relative h-10 w-10 hover:text-[#E0A995] transition-all active:scale-95"
              aria-label="Open Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalCartItems > 0 && (
                <span className="absolute top-0 right-0 bg-[#E0A995] text-[#0A1612] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none shadow-sm">
                  {totalCartItems > 9 ? '9+' : totalCartItems}
                </span>
              )}
            </Button>

            <Button
              onClick={() => setIsOpen(true)}
              variant="ghost"
              size="icon"
              className="lg:hidden h-10 w-10 hover:text-[#E0A995] transition-colors"
              aria-label="Open Menu"
              aria-expanded={isOpen}
            >
              <Menu className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-out Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
            className="fixed inset-0 z-[1100] bg-[#0A1612]/98 backdrop-blur-xl flex flex-col"
            role="dialog"
            aria-modal="true"
          >
            <div className="w-full flex items-center justify-between px-4 sm:px-6 border-b border-[#E0A995]/10 h-[72px] flex-shrink-0">
              <div className="w-10 h-10 rounded-full border-2 border-[#E0A995] bg-[#0A1612] flex items-center justify-center overflow-hidden">
                <LogoComponent size="sm" className="w-full h-full" />
              </div>
              <Button
                onClick={() => setIsOpen(false)}
                variant="ghost"
                size="icon"
                className="h-10 w-10 text-[#EBE8E3] hover:text-[#E0A995]"
              >
                <X className="w-6 h-6" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col gap-6">
              <nav className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.name}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `text-xl font-serif font-medium py-3 border-b border-[#E0A995]/10 transition-colors ${
                        isActive ? 'text-[#E0A995]' : 'text-[#EBE8E3] hover:text-[#E0A995]'
                      }`
                    }
                  >
                    {link.name}
                  </NavLink>
                ))}
              </nav>

              <div className="mt-auto pt-6 border-t border-[#E0A995]/10 flex flex-col gap-4">
                <div className="flex justify-start items-center gap-4">
                  <LanguageSelector />
                  <CurrencySelector />
                </div>

                {!user ? (
                  <Button
                    onClick={() => { setIsOpen(false); navigate('/auth'); }}
                    className="w-full h-14 text-lg bg-[#E0A995] text-[#0A1612] hover:bg-[#D49A89] font-bold tracking-wide uppercase"
                  >
                    Sign In / Sign Up
                  </Button>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Button
                      onClick={() => { setIsOpen(false); navigate('/client-messaging'); }}
                      variant="outline"
                      className="w-full h-12 border-[#E0A995] text-[#EBE8E3]"
                    >
                      Messages {unreadCount > 0 && `(${unreadCount})`}
                    </Button>
                    <Button
                      onClick={() => { setIsOpen(false); navigate('/admin'); }}
                      variant="outline"
                      className="w-full h-12 border-[#E0A995] text-[#EBE8E3]"
                    >
                      Dashboard
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;