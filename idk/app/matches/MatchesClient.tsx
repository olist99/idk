'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { User } from '@/lib/data';
import { useState } from 'react';

interface MatchesClientProps {
  initialMatches: User[];
}

export default function MatchesClient({ initialMatches }: MatchesClientProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'snogs' | 'marries'>('all');

  const tabs = [
    { id: 'all', label: 'All Matches', count: initialMatches.length },
    { id: 'snogs', label: 'Snogs', count: Math.floor(initialMatches.length / 2) },
    { id: 'marries', label: 'Marries', count: Math.floor(initialMatches.length / 3) },
  ];

  return (
    <div className="max-w-lg mx-auto px-4">
      {/* Tabs */}
      <div className="mb-6 flex gap-2 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-6 py-3 rounded-full whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-primary-500 to-purple-600 text-white shadow-lg'
                : 'glass text-white/60 hover:text-white'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-6 rounded-2xl mb-6"
      >
        <h2 className="text-lg font-semibold mb-4">Your Stats</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold gradient-text mb-1">
              {initialMatches.length}
            </div>
            <div className="text-sm text-white/60">Total</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-400 mb-1">
              {Math.floor(initialMatches.length / 2)}
            </div>
            <div className="text-sm text-white/60">Snogs</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-pink-400 mb-1">
              {Math.floor(initialMatches.length / 3)}
            </div>
            <div className="text-sm text-white/60">Marries</div>
          </div>
        </div>
      </motion.div>

      {/* Matches grid */}
      {initialMatches.length > 0 ? (
        <div className="grid grid-cols-2 gap-4">
          {initialMatches.map((match, index) => (
            <motion.div
              key={match.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/profile/${match.id}`}>
                <div className="glass rounded-2xl overflow-hidden card-hover group cursor-pointer">
                  <div className="relative aspect-[3/4]">
                    <Image
                      src={match.photos[0]}
                      alt={match.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    
                    {/* Online indicator */}
                    {match.isOnline && (
                      <div className="absolute top-3 right-3 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse" />
                    )}

                    {/* Info */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="font-semibold text-lg mb-1">
                        {match.name}, {match.age}
                      </h3>
                      <p className="text-sm text-white/80 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        {match.location}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary-500/20 to-purple-600/20 flex items-center justify-center">
            <svg className="w-12 h-12 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">No matches yet</h3>
          <p className="text-white/60 mb-6">
            Start swiping to find your matches!
          </p>
          <Link
            href="/"
            className="inline-block px-8 py-4 bg-gradient-to-r from-primary-500 to-purple-600 rounded-full font-semibold shadow-lg"
          >
            Start Discovering
          </Link>
        </motion.div>
      )}
    </div>
  );
}
