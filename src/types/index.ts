export interface User {
  id: string;
  nickname: string;
  isPlayer: boolean;
  isReady: boolean;
  color?: 'black' | 'white';
}

export interface Room {
  id: string;
  players: User[];
  spectators: User[];
  gameState: 'waiting' | 'playing' | 'ended';
  board: number[][];
  currentTurn: 'black' | 'white';
  winner?: User;
}

export interface RoomMessage {
  type: 'roomUpdate' | 'gameStart' | 'gameMove' | 'gameEnd' | 'roomClosed';
  room: Room;
}
