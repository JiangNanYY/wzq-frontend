import React from 'react';
import { motion } from 'framer-motion';

interface BoardProps {
  board: number[][];
  onCellClick: (x: number, y: number) => void;
  disabled?: boolean;
}

export const Board: React.FC<BoardProps> = ({ board, onCellClick, disabled }) => {
  const gridSize = 15; // 15x15 intersections
  const cellSpacing = 32; // space between lines
  const margin = 20; // margin around the board
  const boardWidth = (gridSize - 1) * cellSpacing;

  return (
    <div className="relative p-4 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl shadow-2xl">
      <div 
        className="relative"
        style={{ 
          width: boardWidth + margin * 2,
          height: boardWidth + margin * 2,
          background: 'linear-gradient(135deg, #dcb35c 0%, #c49a4a 100%)'
        }}
      >
        {/* SVG Grid */}
        <svg 
          className="absolute inset-0"
          style={{ width: '100%', height: '100%' }}
        >
          {/* Vertical lines */}
          {Array.from({ length: gridSize }).map((_, i) => (
            <line
              key={`v-${i}`}
              x1={margin + i * cellSpacing}
              y1={margin}
              x2={margin + i * cellSpacing}
              y2={margin + boardWidth}
              stroke="#5c4a2f"
              strokeWidth="1.5"
            />
          ))}
          
          {/* Horizontal lines */}
          {Array.from({ length: gridSize }).map((_, i) => (
            <line
              key={`h-${i}`}
              x1={margin}
              y1={margin + i * cellSpacing}
              x2={margin + boardWidth}
              y2={margin + i * cellSpacing}
              stroke="#5c4a2f"
              strokeWidth="1.5"
            />
          ))}

          {/* Star points */}
          {[
            [3, 3], [11, 3], [7, 7], [3, 11], [11, 11]
          ].map(([x, y]) => (
            <circle
              key={`star-${x}-${y}`}
              cx={margin + x * cellSpacing}
              cy={margin + y * cellSpacing}
              r={4}
              fill="#5c4a2f"
            />
          ))}
        </svg>

        {/* Clickable areas and pieces */}
        {Array.from({ length: gridSize }).map((_, y) =>
          Array.from({ length: gridSize }).map((_, x) => {
            const piece = board[y]?.[x] || 0;
            return (
              <div
                key={`pos-${x}-${y}`}
                className="absolute cursor-pointer rounded-full hover:bg-black/10 transition-colors flex items-center justify-center"
                style={{
                  left: margin + x * cellSpacing - cellSpacing/2,
                  top: margin + y * cellSpacing - cellSpacing/2,
                  width: cellSpacing,
                  height: cellSpacing,
                }}
                onClick={() => !disabled && onCellClick(x, y)}
              >
                {piece !== 0 && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                    className="rounded-full shadow-lg"
                    style={{
                      width: cellSpacing * 0.85,
                      height: cellSpacing * 0.85,
                      background: piece === 1 
                        ? 'radial-gradient(circle at 30% 30%, #4a4a4a, #000)'
                        : 'radial-gradient(circle at 30% 30%, #fff, #d0d0d0)',
                      border: piece === 1 ? '1px solid #333' : '1px solid #999',
                    }}
                  >
                    {piece === 1 && (
                      <div 
                        className="absolute rounded-full opacity-40"
                        style={{
                          width: '30%',
                          height: '20%',
                          background: 'radial-gradient(ellipse, #666, transparent)',
                          top: '15%',
                          left: '20%',
                        }}
                      />
                    )}
                  </motion.div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
