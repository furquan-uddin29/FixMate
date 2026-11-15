'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ROLES, getRoleHome } from './roles';
import { supabase, isSupabaseConfigured } from '../supabase/client';

const AuthContext = createContext(null);

// Default demo users for immediate CSE 3292 evaluation
export const DEMO_ACCOUNTS = {
  customer: {
    id: 'usr-customer-01',
    email: 'sarah.jenkins@example.com',
    full_name: 'Sarah Jenkins',
    phone: '+1 (555) 111-2233',
    role: ROLES.CUSTOMER,
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
    address: '742 Evergreen Terrace, Apt 4B',
    city: 'Downtown Metro',
  },
  technician: {
    id: 'usr-tech-01',
    technician_id: 'tech-01',
    email: 'david.miller@fixmate.test',
    full_name: 'David Miller',
    phone: '+1 (555) 234-5678',
    role: ROLES.TECHNICIAN,
    avatar_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=256&q=80',
    address: '428 Oak Avenue, Suite 3',
    city: 'Downtown Metro',
    service_categories: ['Plumbing'],
    verification_status: 'verified',
  },
  admin: {
    id: 'usr-admin-01',
    email: 'admin@fixmate.test',
    full_name: 'Alexander Sterling',
    phone: '+1 (555) 999-0000',
    role: ROLES.ADMIN,
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&q=80',
    address: 'FixMate Headquarters, Level 14',
    city: 'Downtown Metro',
  },
};

export function AuthProvider({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check persistent session on mount
  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      try {
        if (isSupabaseConfigured() && supabase) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user && mounted) {
            // Fetch profile role from Supabase
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            const role = profile?.role || session.user.user_metadata?.role || ROLES.CUSTOMER;
            setUser({
              id: session.user.id,
              email: session.user.email,
              full_name: profile?.full_name || session.user.user_metadata?.full_name || 'FixMate User',
              role,
              avatar_url: profile?.avatar_url,
              phone: profile?.phone,
            });
            setRole(role);
            setLoading(false);
            return;
          }
        }

        // Demo session stored in browser session storage for testing convenience
        if (typeof window !== 'undefined') {
          const stored = window.sessionStorage.getItem('fixmate_active_user');
          if (stored) {
            const parsed = JSON.parse(stored);
            if (mounted) {
              setUser(parsed);
              setRole(parsed.role);
            }
          } else {
            // Default initial guest/evaluator as Customer for preview
            const defaultUser = DEMO_ACCOUNTS.customer;
            if (mounted) {
              setUser(defaultUser);
              setRole(defaultUser.role);
              window.sessionStorage.setItem('fixmate_active_user', JSON.stringify(defaultUser));
            }
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    initAuth();

    // Supabase auth state listener
    let authListener = null;
    if (isSupabaseConfigured() && supabase) {
      const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          const userRole = profile?.role || session.user.user_metadata?.role || ROLES.CUSTOMER;
          setUser({
            id: session.user.id,
            email: session.user.email,
            full_name: profile?.full_name || 'FixMate User',
            role: userRole,
            avatar_url: profile?.avatar_url,
          });
          setRole(userRole);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setRole(null);
        }
      });
      authListener = data.subscription;
    }

    return () => {
      mounted = false;
      if (authListener) authListener.unsubscribe();
    };
  }, []);

  // Login handler
  const login = async (email, password) => {
    setLoading(true);
    try {
      if (isSupabaseConfigured() && supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;

        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        const userRole = profile?.role || ROLES.CUSTOMER;
        const loggedUser = {
          id: data.user.id,
          email: data.user.email,
          full_name: profile?.full_name || 'User',
          role: userRole,
        };
        setUser(loggedUser);
        setRole(userRole);
        router.push(getRoleHome(userRole));
        return { success: true, role: userRole };
      }

      // Local demo evaluation check
      const matchedKey = Object.keys(DEMO_ACCOUNTS).find(
        k => DEMO_ACCOUNTS[k].email.toLowerCase() === email.toLowerCase()
      );

      const activeUser = matchedKey
        ? DEMO_ACCOUNTS[matchedKey]
        : {
            id: `usr-${Date.now()}`,
            email,
            full_name: email.split('@')[0],
            role: email.includes('admin') ? ROLES.ADMIN : (email.includes('tech') ? ROLES.TECHNICIAN : ROLES.CUSTOMER),
            avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80',
          };

      setUser(activeUser);
      setRole(activeUser.role);
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem('fixmate_active_user', JSON.stringify(activeUser));
      }
      router.push(getRoleHome(activeUser.role));
      return { success: true, role: activeUser.role };
    } catch (err) {
      console.error('Login error:', err);
      return { success: false, error: err.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  // Register handler
  const register = async ({ fullName, email, phone, password, accountType }) => {
    setLoading(true);
    try {
      if (accountType === ROLES.ADMIN) {
        throw new Error('Admin registration is strictly prohibited through the public form.');
      }

      if (isSupabaseConfigured() && supabase) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              phone,
              role: accountType,
            },
          },
        });
        if (error) throw error;

        // Insert into public.profiles
        if (data.user) {
          await supabase.from('profiles').insert({
            id: data.user.id,
            full_name: fullName,
            email,
            phone,
            role: accountType,
          });

          if (accountType === ROLES.TECHNICIAN) {
            await supabase.from('technician_profiles').insert({
              user_id: data.user.id,
              service_categories: ['General Repair'],
            });
          }
        }
      }

      const newUser = {
        id: `usr-${Date.now()}`,
        email,
        full_name: fullName,
        phone,
        role: accountType,
        avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&q=80',
      };

      setUser(newUser);
      setRole(newUser.role);
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem('fixmate_active_user', JSON.stringify(newUser));
      }
      router.push(getRoleHome(accountType));
      return { success: true, role: accountType };
    } catch (err) {
      console.error('Registration error:', err);
      return { success: false, error: err.message || 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  // Logout handler
  const logout = async () => {
    try {
      if (isSupabaseConfigured() && supabase) {
        await supabase.auth.signOut();
      }
      if (typeof window !== 'undefined') {
        window.sessionStorage.removeItem('fixmate_active_user');
      }
      setUser(null);
      setRole(null);
      router.push('/');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Demo Switcher for fast evaluation across roles
  const switchRole = (targetRole) => {
    const targetUser = DEMO_ACCOUNTS[targetRole];
    if (targetUser) {
      setUser(targetUser);
      setRole(targetUser.role);
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem('fixmate_active_user', JSON.stringify(targetUser));
      }
      router.push(getRoleHome(targetUser.role));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        loading,
        login,
        register,
        logout,
        switchRole,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
