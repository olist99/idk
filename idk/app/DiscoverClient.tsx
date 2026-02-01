'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProfileCard from '@/components/ProfileCard';
import ActionButtons from '@/components/ActionButtons';
import { User } from '@/lib/data';
import { useStore } from '@/lib/store';

interface DiscoverClientProps {
  initialUsers: User[];
}

export default function DiscoverClient({ initialUsers }: DiscoverClientProps) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { addMatch } = useStore();

  const currentUser = users[currentIndex];

  const handleSwipe = (type: 'snog' | 'marry' | 'avoid') => {
    if (!currentUser) return;

    // Add to store
    addMatch(currentUser.id, type);

    // Move to next user
    setCurrentIndex((prev) => prev + 1);

    // Show feedback
    showFeedback(type);
  };

  const showFeedback = (type: 'snog' | 'marry' | 'avoid') => {
    const messages = {
      snog: "It's a match! 💋",
      marry: "You want to marry them! 💍",
      avoid: "Maybe next time... 👋",
    };

    // You could implement a toast notification here
    console.log(messages[type]);
  };

  if (currentIndex >= users.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] text-center px-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="mb-8"
        >
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-2xl shadow-primary-500/50">
            <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </motion.div>
        
        <h2 className="text-3xl font-display font-bold mb-4">
          You've seen everyone!
        </h2>
        <p className="text-white/60 mb-8 max-w-md">
          Check back soon for more people to discover, or view your matches.
        </p>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setCurrentIndex(0)}
          className="px-8 py-4 bg-gradient-to-r from-primary-500 to-purple-600 rounded-full font-semibold shadow-lg shadow-primary-500/50 hover:shadow-xl hover:shadow-primary-500/60 transition-shadow"
        >
          Start Over
        </motion.button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 text-center"
      >
        <p className="text-white/60 text-sm">
          Swipe right to <span className="text-green-400 font-semibold">Snog</span> • 
          Swipe up to <span className="text-pink-400 font-semibold">Marry</span> • 
          Swipe left to <span className="text-red-400 font-semibold">Avoid</span>
        </p>
      </motion.div>

      {/* Card stack */}
      <div className="relative h-[600px] flex items-center justify-center">
        <AnimatePresence>
          {users.slice(currentIndex, currentIndex + 3).map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{
                scale: 1 - index * 0.05,
                opacity: 1,
                y: index * 10,
                zIndex: users.length - index,
              }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="absolute"
            >
              {index === 0 && (
                <ProfileCard
                  user={user}
                  onSwipe={handleSwipe}
                />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Action buttons */}
      <ActionButtons
        onAvoid={() => handleSwipe('avoid')}
        onMarry={() => handleSwipe('marry')}
        onSnog={() => handleSwipe('snog')}
      />

      {/* Counter */}
      <div className="text-center mt-6">
        <p className="text-white/40 text-sm">
          {currentIndex + 1} / {users.length}
        </p>
      </div>
    </div>
  );
}
