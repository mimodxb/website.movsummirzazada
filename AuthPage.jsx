import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const AuthPage = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const validate = () => {
    setErrorMsg('');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg('Please enter a valid email address.');
      return false;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return false;
    }
    if (!isSignIn && password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    let error = null;

    if (isSignIn) {
      const res = await signIn(email, password);
      error = res.error;
    } else {
      const res = await signUp(email, password, { data: { email } });
      error = res.error;
    }

    setIsLoading(false);

    if (error) {
      setErrorMsg(error.message);
    } else {
      navigate('/');
    }
  };

  const calculateStrength = (pass) => {
    if (pass.length === 0) return 0;
    let strength = 0;
    if (pass.length >= 6) strength += 1;
    if (pass.length >= 10) strength += 1;
    if (/[A-Z]/.test(pass)) strength += 1;
    if (/[0-9]/.test(pass)) strength += 1;
    if (/[^A-Za-z0-9]/.test(pass)) strength += 1;
    return Math.min(strength, 4);
  };

  const strength = calculateStrength(password);
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500'];

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A1612] px-4 py-12 text-[#EBE8E3]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-[#13251E] rounded-xl shadow-2xl border border-[#E0A995]/10 p-8 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#E0A995]/20 via-[#E0A995] to-[#E0A995]/20" />
        
        <h2 className="text-3xl font-serif text-center mb-6 font-bold tracking-wide">
          {isSignIn ? 'Welcome Back' : 'Create Account'}
        </h2>
        
        {errorMsg && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/50 rounded-md text-red-200 text-sm text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-[#A8B3AF]">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="bg-[#0A1612] border-[#E0A995]/40 focus:border-[#E0A995] text-[#EBE8E3] placeholder:text-[#A8B3AF]/50"
              required
            />
          </div>

          <div className="space-y-2 relative">
            <Label htmlFor="password" className="text-[#A8B3AF]">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-[#0A1612] border-[#E0A995]/40 focus:border-[#E0A995] text-[#EBE8E3] placeholder:text-[#A8B3AF]/50 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A8B3AF] hover:text-[#E0A995] transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            
            {!isSignIn && password.length > 0 && (
              <div className="mt-2 flex gap-1 h-1 w-full rounded-full overflow-hidden bg-[#0A1612]">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className={`flex-1 transition-all duration-300 ${i < strength ? strengthColors[Math.max(0, strength - 1)] : 'bg-transparent'}`}
                  />
                ))}
              </div>
            )}
          </div>

          <AnimatePresence>
            {!isSignIn && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2 relative overflow-hidden"
              >
                <Label htmlFor="confirmPassword" className="text-[#A8B3AF]">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="bg-[#0A1612] border-[#E0A995]/40 focus:border-[#E0A995] text-[#EBE8E3] placeholder:text-[#A8B3AF]/50 pr-10"
                    required={!isSignIn}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A8B3AF] hover:text-[#E0A995] transition-colors"
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-transparent border border-[#E0A995] text-[#EBE8E3] hover:bg-[#E0A995] hover:text-[#0A1612] font-semibold py-6 transition-all duration-300 uppercase tracking-widest mt-4"
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={24} />
            ) : isSignIn ? (
              'Sign In'
            ) : (
              'Sign Up'
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsSignIn(!isSignIn);
              setErrorMsg('');
              setPassword('');
              setConfirmPassword('');
            }}
            className="text-sm text-[#A8B3AF] hover:text-[#E0A995] transition-colors"
          >
            {isSignIn
              ? "Don't have an account? Sign Up"
              : 'Already have an account? Sign In'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;