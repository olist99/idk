import { create } from 'zustand';
import { User, Match } from './data';

interface AppState {
  currentUser: User | null;
  discoveryQueue: User[];
  matches: Match[];
  snogs: string[];
  marries: string[];
  avoids: string[];
  setCurrentUser: (user: User) => void;
  setDiscoveryQueue: (users: User[]) => void;
  addMatch: (userId: string, type: 'snog' | 'marry' | 'avoid') => void;
  removeFromQueue: () => void;
}

export const useStore = create<AppState>((set) => ({
  currentUser: null,
  discoveryQueue: [],
  matches: [],
  snogs: [],
  marries: [],
  avoids: [],
  setCurrentUser: (user) => set({ currentUser: user }),
  setDiscoveryQueue: (users) => set({ discoveryQueue: users }),
  addMatch: (userId, type) =>
    set((state) => {
      const newMatch: Match = {
        userId,
        type,
        timestamp: new Date(),
      };
      
      let updatedState: Partial<AppState> = {
        matches: [...state.matches, newMatch],
      };

      if (type === 'snog') {
        updatedState.snogs = [...state.snogs, userId];
      } else if (type === 'marry') {
        updatedState.marries = [...state.marries, userId];
      } else {
        updatedState.avoids = [...state.avoids, userId];
      }

      return updatedState;
    }),
  removeFromQueue: () =>
    set((state) => ({
      discoveryQueue: state.discoveryQueue.slice(1),
    })),
}));
