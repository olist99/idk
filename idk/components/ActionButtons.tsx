'use client';

import { motion } from 'framer-motion';

interface ActionButtonsProps {
  onSnog: () => void;
  onMarry: () => void;
  onAvoid: () => void;
}

export default function ActionButtons({ onSnog, onMarry, onAvoid }: ActionButtonsProps) {
  return (
    <div className="flex items-center justify-center gap-6 mt-8">
      {/* Avoid button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onAvoid}
        className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-red-600 shadow-lg shadow-red-500/50 flex items-center justify-center group hover:shadow-xl hover:shadow-red-500/60 transition-shadow"
        aria-label="Avoid"
      >
        <svg
          className="w-8 h-8 text-white group-hover:scale-110 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </motion.button>

      {/* Marry button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onMarry}
        className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 shadow-lg shadow-pink-500/50 flex items-center justify-center group hover:shadow-xl hover:shadow-pink-500/60 transition-shadow"
        aria-label="Marry"
      >
        <svg
          className="w-10 h-10 text-white group-hover:scale-110 transition-transform"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
            clipRule="evenodd"
          />
        </svg>
      </motion.button>

      {/* Snog button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onSnog}
        className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/50 flex items-center justify-center group hover:shadow-xl hover:shadow-green-500/60 transition-shadow"
        aria-label="Snog"
      >
        <svg
          className="w-8 h-8 text-white group-hover:scale-110 transition-transform"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
        </svg>
      </motion.button>
    </div>
  );
}
