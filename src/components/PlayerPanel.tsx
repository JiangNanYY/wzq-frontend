import React from 'react';
import { User, Crown, Eye } from 'lucide-react';
import { motion } from 'framer-motion';

interface PlayerPanelProps {
  players: any[];
  spectators: any[];
  currentTurn?: 'black' | 'white';
  gameState: string;
}

export const PlayerPanel: React.FC<PlayerPanelProps> = ({ 
  players, 
  spectators,
  currentTurn,
  gameState 
}) => {
  return (
    <div className="w-72 space-y-4">
      {/* Players section */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/50">
        <div className="flex items-center gap-2 mb-4">
          <Crown className="w-5 h-5 text-amber-500" />
          <h3 className="text-lg font-bold text-gray-800">对战玩家</h3>
        </div>
        
        <div className="space-y-3">
          {[0, 1].map((index) => {
            const player = players[index];
            const color = index === 0 ? 'black' : 'white';
            const isTurn = currentTurn === color && gameState === 'playing';
            
            return (
              <motion.div
                key={color}
                animate={isTurn ? { scale: 1.02 } : { scale: 1 }}
                className={`relative p-4 rounded-xl border-2 transition-all ${
                  player 
                    ? isTurn 
                      ? "border-cyan-400 bg-cyan-50 shadow-lg"
                      : "border-gray-200 bg-gray-50"
                    : "border-dashed border-gray-300 bg-gray-100/50"
                }`}
              >
                {player ? (
                  <>
                    <div className="flex items-center gap-3">
                      <div 
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-md ${
                          color === 'black' 
                            ? "bg-gray-900 text-white" 
                            : "bg-white text-gray-900 border-2 border-gray-300"
                        }`}
                      >
                        {color === 'black' ? '●' : '○'}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-800">{player.nickname}</p>
                        <p className="text-xs text-gray-500">
                          {color === 'black' ? '黑棋' : '白棋'}
                        </p>
                      </div>
                      {isTurn && (
                        <motion.div
                          animate={{ opacity: [1, 0.5, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="w-3 h-3 bg-cyan-400 rounded-full"
                        />
                      )}
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-3 text-gray-400">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="w-5 h-5" />
                    </div>
                    <p className="font-medium">等待玩家...</p>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Spectators section */}
      {spectators.length > 0 && (
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/50">
          <div className="flex items-center gap-2 mb-4">
            <Eye className="w-5 h-5 text-purple-500" />
            <h3 className="text-lg font-bold text-gray-800">
              观战观众 ({spectators.length})
            </h3>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {spectators.map((spectator) => (
              <div
                key={spectator.id}
                className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
              >
                {spectator.nickname}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
