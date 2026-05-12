import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Sparkles, Frown } from 'lucide-react';

interface VictoryAnimationProps {
  winner: string;
  onClose: () => void;
  isWinner: boolean;
  isSpectator: boolean;
}

const colors = [
  '#f97316',
  '#06b6d4',
  '#1e3a8a',
  '#8b5cf6',
  '#ec4899',
  '#10b981',
];

const Confetti = ({ delay = 0 }) => {
  const color = colors[Math.floor(Math.random() * colors.length)];
  const size = Math.random() * 20 + 10;
  
  return (
    <motion.div
      className="absolute"
      initial={{
        x: Math.random() * window.innerWidth,
        y: -50,
        rotate: Math.random() * 360,
        scale: 0,
      }}
      animate={{
        y: window.innerHeight + 50,
        rotate: Math.random() * 720,
        scale: 1,
      }}
      transition={{
        duration: Math.random() * 2 + 2,
        delay,
        ease: 'easeOut',
      }}
      style={{
          width: size,
          height: size,
          backgroundColor: color,
          borderRadius: Math.random() > 0.5 ? '50%' : '0',
        }}
    />
  );
};

export const VictoryAnimation: React.FC<VictoryAnimationProps> = ({ winner, onClose, isWinner, isSpectator }) => {
  const [confetti, setConfetti] = useState<number[]>([]);

  console.log('VictoryAnimation - winner:', winner, 'isWinner:', isWinner, 'isSpectator:', isSpectator);

  useEffect(() => {
    if (isWinner || isSpectator) {
      const pieces = Array.from({ length: 100 }).map((_, i) => i);
      setConfetti(pieces);
    }
  }, [isWinner, isSpectator]);

  // 确定动画风格和文字
  const getTitle = () => {
    if (isSpectator) {
      return `🎉 恭喜${winner}胜利！`;
    }
    return isWinner ? `🎉 恭喜你胜利！` : `😢 再接再厉！`;
  };

  const getIcon = () => {
    if (isSpectator || isWinner) {
      return (
        <div className="relative">
          <Trophy className="w-24 h-24 text-yellow-500 drop-shadow-lg" />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            className="absolute -top-4 -right-4"
          >
            <Sparkles className="w-8 h-8 text-yellow-400" />
          </motion.div>
        </div>
      );
    }
    return (
      <div className="relative">
        <Frown className="w-24 h-24 text-red-400 drop-shadow-lg" />
      </div>
    );
  };

  const getBackgroundColor = () => {
    if (isSpectator || isWinner) {
      return 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-400';
    }
    return 'bg-gradient-to-br from-gray-100 to-gray-200 border-gray-400';
  };

  const getTextGradient = () => {
    if (isSpectator || isWinner) {
      return 'from-yellow-600 via-orange-500 to-pink-500';
    }
    return 'from-gray-600 to-gray-700';
  };

  const getButtonColor = () => {
    if (isSpectator || isWinner) {
      return 'bg-gradient-to-r from-yellow-500 to-orange-500';
    }
    return 'bg-gradient-to-r from-gray-500 to-gray-600';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      
      {/* Confetti - only for winner or spectator */}
      {(isWinner || isSpectator) && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {confetti.map((i) => (
            <Confetti key={i} delay={i * 0.02} />
          ))}
        </div>
      )}

      {/* Main content */}
      <motion.div
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="relative z-10 text-center"
      >
        {/* Outer glow ring - only for winner or spectator */}
        {(isWinner || isSpectator) && (
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
            className="absolute inset-0 -m-8 rounded-full bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 blur-2xl opacity-50"
          />
        )}

        <div className={`relative rounded-3xl p-12 shadow-2xl border-4 ${getBackgroundColor()}`}>
          {/* Icon */}
          <motion.div
            initial={{ y: -20 }}
            animate={{ y: isWinner || isSpectator ? [0, -10, 0] : 0 }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="flex justify-center mb-6"
          >
            {getIcon()}
          </motion.div>

          {/* Winner text */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`text-5xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r ${getTextGradient()} mb-6`}
          >
            {getTitle()}
          </motion.h2>

          {/* Close button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className={`px-8 py-4 text-white font-bold text-xl rounded-full shadow-lg hover:shadow-xl transition-all ${getButtonColor()}`}
          >
            继续游戏
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};
