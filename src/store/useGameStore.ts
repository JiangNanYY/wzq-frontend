import { create } from 'zustand';
import { Room, User } from '../types';

interface GameState {
  userId: string;
  nickname: string;
  roomId: string | null;
  room: Room | null;
  showVictory: boolean;
  setUserId: (id: string) => void;
  setNickname: (name: string) => void;
  setRoomId: (id: string | null) => void;
  setRoom: (room: Room | null) => void;
  setShowVictory: (show: boolean) => void;
  resetState: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  userId: localStorage.getItem('gomokuUserId') || Math.random().toString(36).substr(2, 9),
  nickname: localStorage.getItem('gomokuNickname') || '',
  roomId: null,
  room: null,
  showVictory: false,
  
  setUserId: (id) => {
    localStorage.setItem('gomokuUserId', id);
    set({ userId: id });
  },
  
  setNickname: (name) => {
    localStorage.setItem('gomokuNickname', name);
    set({ nickname: name });
  },
  
  setRoomId: (id) => set({ roomId: id }),
  setRoom: (room) => set({ room }),
  setShowVictory: (show) => set({ showVictory: show }),
  
  resetState: () => set({ roomId: null, room: null, showVictory: false }),
}));
