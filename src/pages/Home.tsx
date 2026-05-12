import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Copy, Check, ArrowRight, Gamepad2 } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';

export const Home: React.FC = () => {
  console.log('Home component rendering');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { nickname, setNickname, setRoomId } = useGameStore();
  const [isCreating, setIsCreating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [inviteUrl, setInviteUrl] = useState('');

  const roomIdFromUrl = searchParams.get('room');

  const handleCreateRoom = async () => {
    if (!nickname.trim()) return;
    
    setIsCreating(true);
    try {
      const response = await fetch('http://localhost:8888/api/rooms', {
        method: 'POST',
      });
      const data = await response.json();
      
      const url = `${window.location.origin}?room=${data.roomId}`;
      setInviteUrl(url);
      setRoomId(data.roomId);
    } catch (error) {
      console.error('Failed to create room:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleJoinRoom = () => {
    if (!nickname.trim() || !roomIdFromUrl) return;
    setRoomId(roomIdFromUrl);
    navigate(`/room/${roomIdFromUrl}`);
  };

  const handleEnterRoom = () => {
    const roomId = new URL(inviteUrl).searchParams.get('room');
    if (roomId) {
      navigate(`/room/${roomId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-slate-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-500/20 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', bounce: 0.5 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-cyan-500 to-cyan-400 rounded-2xl shadow-2xl mb-4"
          >
            <Gamepad2 className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-5xl font-black text-white mb-2">
            五子棋
          </h1>
          <p className="text-blue-200 text-lg">与好友在线对战</p>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
          {!inviteUrl ? (
            <div className="space-y-6">
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  你的昵称
                </label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="输入你的名字"
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                />
              </div>

              {roomIdFromUrl ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleJoinRoom}
                  disabled={!nickname.trim()}
                  className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-400 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  加入房间
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCreateRoom}
                  disabled={!nickname.trim() || isCreating}
                  className="w-full py-4 bg-gradient-to-r from-cyan-500 to-cyan-400 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isCreating ? (
                    '创建中...'
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      创建房间
                    </>
                  )}
                </motion.button>
              )}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  房间创建成功！
                </h2>
                <p className="text-blue-200">分享链接邀请好友加入</p>
              </div>

              <div className="flex gap-3">
                <div className="flex-1 px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white text-sm truncate">
                  {inviteUrl}
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCopyLink}
                  className="px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white hover:bg-white/30 transition-all"
                >
                  {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
                </motion.button>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleEnterRoom}
                className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-400 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                进入房间
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
