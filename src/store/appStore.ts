import { create } from 'zustand';

export interface Category {
  id: string;
  name: string;
  iconUrl: string;
  isActive: boolean;
  createdAt: any;
}

export interface Job {
  id: string;
  customerId: string;
  providerId: string;
  category: string;
  status: 'pending' | 'accepted' | 'declined' | 'completed';
  date: string;
  details: string;
  createdAt: any;
}

interface AppState {
  categories: Category[];
  jobs: Job[];
  setCategories: (categories: Category[]) => void;
  setJobs: (jobs: Job[]) => void;
}

export const useAppStore = create<AppState>((set) => ({
  categories: [],
  jobs: [],
  setCategories: (categories) => set({ categories }),
  setJobs: (jobs) => set({ jobs }),
}));
