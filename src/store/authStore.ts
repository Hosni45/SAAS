import { create } from 'zustand';
import { User } from 'firebase/auth';

export type UserRole = 'customer' | 'provider' | 'admin';

interface UserProfile {
  uid: string;
  email: string;
  role: UserRole;
  displayName: string;
  photoURL?: string;
  rating?: number;
  serviceCategory?: string;
  bio?: string;
}

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setProfile: (profile: UserProfile | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => Promise<void>;
}

import { auth } from '../lib/firebase';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  loading: true,
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setLoading: (loading) => set({ loading }),
  logout: async () => {
    await auth.signOut();
    set({ user: null, profile: null });
  },
}));
