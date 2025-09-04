import { createContext } from 'react';
import { User, Session } from '@supabase/supabase-js';

export type UserRole = 'owner' | 'admin' | 'staff' | 'customer';

export interface UserProfile {
  id: string;
  user_id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  address: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, firstName?: string, lastName?: string) => Promise<{ error: unknown }>;
  signIn: (email: string, password: string) => Promise<{ error: unknown }>;
  signOut: () => Promise<void>;
  resetPassword?: (email: string) => Promise<{ error: unknown }>;
  updateProfile?: (updates: { full_name?: string; avatar_url?: string }) => Promise<{ error: unknown }>;
  isAdmin: () => boolean;
  hasRole: (role: UserRole) => boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
