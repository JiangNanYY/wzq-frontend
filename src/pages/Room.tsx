import React, { useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Board } from '../components/Board';
import { PlayerPanel } from '../components/PlayerPanel';
import { VictoryAnimation } from '../components/VictoryAnimation';
import { useWebSocket } from '../hooks/useWebSocket';
import { useGameStore } from '../store/useGameStore';
import { RoomMessage } from '../types';
import { Play, Copy, Check, LogOut } from 'lucide-react';

export const Room: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { 
    userId, nickname, room, setRoom, setRoomId, setShowVictory, showVictory, resetState
  } = useGameStore();
  const [copied, setCopied] = React.useState(false);

  const handleMessage = useCallback((message: RoomMessage) => {
    if (message.type === 'roomClosed') {
      navigate('/');
      return;
    }
    
    setRoom(message.room);
    
    if (message.type === 'gameEnd') {
      setTimeout(() => setShowVictory(true), 500);
    }
  }, [setRoom, setShowVictory, navigate]);

  const { send, connected } = useWebSocket(roomId || null, handleMessage);

  useEffect(() => {
    if (roomId && connected) {
      setRoomId(roomId);
      send(`/app/room/${roomId}/join`, { userId, nickname });
    }

    return () => {
      if (roomId && connected) {
        send(`/app/room/${roomId}/leave`, { userId });
      }
    };
  }, [roomId, userId, nickname, connected, send, setRoomId]);

  const handleStart = () => {
    if (!roomId) return;
    send(`/app/room/${roomId}/start`, { userId });
  };

  const handleCellClick = (x: number, y: number) => {
    if (!roomId || !room) return;
    
    const currentPlayer = room.players.find(p => p.id === userId);
    if (!currentPlayer || room.currentTurn !== currentPlayer.color) return;

    send(`/app/room/${roomId}/move`, { userId, x, y, color: currentPlayer.color });
  };

  const handleLeave = () => {
    if (roomId && connected) {
      send(`/app/room/${roomId}/leave`, { userId });
    }
    resetState();
    navigate('/');
  };

  const handleCopyLink = () => {
    const url = `${window.location.origin}?room=${roomId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const currentPlayer = room?.players.find(p => p.id === userId);
  const isMyTurn = room?.gameState === 'playing' && room.currentTurn === currentPlayer?.color;
  
  // 只要是waiting或ended状态，并且players少于2人，就可以开始
  const canStart = (room?.gameState === 'waiting' || room?.gameState === 'ended') && 
                  room?.players.length < 2;
  
  const isParticipatingPlayer = currentPlayer !== undefined;
  const isSpectator = room && !isParticipatingPlayer;
  const isWinner = room?.winner?.id === userId;

  console.log('Room - userId:', userId, 'winner:', room?.winner, 'isWinner:', isWinner, 'canStart:', canStart);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {showVictory && room?.winner && (
        <VictoryAnimation
          winner={room.winner.nickname}
          onClose={() => setShowVictory(false)}
          isWinner={isWinner}
          isSpectator={isSpectator}
        />
      )}

      <header className="relative z-20 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-white">五子棋</h1>
            <span className="px-3 py-1 bg-white/10 rounded-lg text-white/80 text-sm">
              房间: {roomId}
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCopyLink}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span className="text-sm">{copied ? '已复制!' : '复制链接'}</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLeave}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">离开</span>
            </motion.button>
          </div>
        </div>
      </header>

      <main className="relative z-10 px-6 pb-6">
        <div className="max-w-7xl mx-auto flex items-start justify-center gap-8">
          <div className="flex flex-col items-center">
            {room ? (
              <div className="relative">
                <Board
                  board={room.board}
                  onCellClick={handleCellClick}
                  disabled={!isMyTurn || room.gameState !== 'playing'}
                />
                
                {room.gameState === 'waiting' && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-white text-xl font-medium mb-4">
                        等待玩家加入...
                      </p>
                    </div>
                  </div>
                )}

                {room.gameState === 'playing' && (
                  <div className="mt-4 text-center">
                    <motion.div
                      key={room.currentTurn}
                      initial={{ scale: 1 }}
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-xl"
                    >
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{
                          background: room.currentTurn === 'black' ? '#000' : '#fff',
                          border: room.currentTurn === 'white' ? '2px solid #999' : 'none'
                        }}
                      />
                      <span className="text-white font-medium">
                        {isMyTurn ? '你的回合' : '对方回合'}
                      </span>
                    </motion.div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-white py-12">
                连接中...
              </div>
            )}

            <div className="mt-6 flex gap-4">
              {canStart && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleStart}
                  className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-400 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                >
                  <Play className="w-5 h-5" />
                  开始游戏
                </motion.button>
              )}

              {isSpectator && room?.gameState === 'playing' && (
                <div className="px-6 py-3 bg-white/10 text-white/70 rounded-xl">
                  观战模式
                </div>
              )}
            </div>
          </div>

          {room && (
            <PlayerPanel
              players={room.players}
              spectators={room.spectators}
              currentTurn={room.currentTurn}
              gameState={room.gameState}
            />
          )}
        </div>
      </main>
    </div>
  );
};
