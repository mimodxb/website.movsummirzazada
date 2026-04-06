// This file is deprecated and should not be used.
// Please import from '@/contexts/SupabaseAuthContext' (src/contexts/SupabaseAuthContext.jsx) instead.

export const AuthProvider = ({ children }) => <>{children}</>;
export const useAuth = () => { 
  throw new Error("Incorrect import: Please import useAuth from '@/contexts/SupabaseAuthContext'"); 
};