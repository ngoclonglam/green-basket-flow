import { createContext } from 'react';
import { User, Session } from '@supabase/supabase-js';

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, firstName?: string, lastName?: string) => Promise<{ error: unknown }>;
  signIn: (email: string, password: string) => Promise<{ error: unknown }>;
  signOut: () => Promise<void>;
  resetPassword?: (email: string) => Promise<{ error: unknown }>;
  updateProfile?: (updates: { full_name?: string; avatar_url?: string }) => Promise<{ error: unknown }>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
