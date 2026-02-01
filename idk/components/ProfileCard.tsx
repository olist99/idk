'use client';

import { useState } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { User } from '@/lib/data';
import Image from 'next/image';

interface ProfileCardProps {
  user: User;
  onSwipe: (direction: 'snog' | 'marry' | 'avoid') => void;
}

export default function ProfileCard({ user, onSwipe }: ProfileCardProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x > 150) {
      onSwipe('snog');
    } else if (info.offset.x < -150) {
      onSwipe('avoid');
    } else if (info.offset.y < -150) {
      onSwipe('marry');
    }
  };

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % user.photos.length);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + user.photos.length) % user.photos.length);
  };

  return (
    <motion.div
      className="absolute w-full max-w-sm h-[600px] cursor-grab active:cursor-grabbing"
      style={{ x, rotate, opacity }}
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragEnd={handleDragEnd}
      whileTap={{ cursor: 'grabbing' }}
    >
      <div className="relative w-full h-full rounded-3xl overflow-hidden glass-dark shadow-2xl">
        {/* Photo with navigation */}
        <div className="relative w-full h-full group">
          <Image
            src={user.photos[currentPhotoIndex]}
            alt={user.name}
            fill
            className="object-cover"
            priority
          />
          
          {/* Photo indicators */}
          <div className="absolute top-4 left-0 right-0 flex gap-2 px-4 z-10">
            {user.photos.map((_, idx) => (
              <div
                key={idx}
                className={`h-1 flex-1 rounded-full transition-all ${
                  idx === currentPhotoIndex
                    ? 'bg-white'
                    : 'bg-white/30'
                }`}
              />
            ))}
          </div>

          {/* Navigation areas */}
          {user.photos.length > 1 && (
            <>
              <button
                onClick={prevPhoto}
                className="absolute left-0 top-0 bottom-0 w-1/3 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity z-10"
                aria-label="Previous photo"
              />
              <button
                onClick={nextPhoto}
                className="absolute right-0 top-0 bottom-0 w-1/3 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity z-10"
                aria-label="Next photo"
              />
            </>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

          {/* User info */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-3xl font-display font-bold">
                {user.name}, {user.age}
              </h2>
              {user.isOnline && (
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
              )}
            </div>
            
            <p className="text-white/80 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              {user.location}
            </p>

            <p className="text-sm text-white/90 mb-4 line-clamp-2">{user.bio}</p>

            {/* Interests */}
            <div className="flex flex-wrap gap-2">
              {user.interests.slice(0, 4).map((interest) => (
                <span
                  key={interest}
                  className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Swipe indicators */}
        <motion.div
          className="absolute top-1/4 right-8 text-6xl font-bold text-green-400 rotate-12 opacity-0 pointer-events-none"
          style={{ opacity: useTransform(x, [0, 100], [0, 1]) }}
        >
          SNOG
        </motion.div>
        <motion.div
          className="absolute top-1/4 left-8 text-6xl font-bold text-red-400 -rotate-12 opacity-0 pointer-events-none"
          style={{ opacity: useTransform(x, [-100, 0], [1, 0]) }}
        >
          AVOID
        </motion.div>
        <motion.div
          className="absolute top-8 left-1/2 -translate-x-1/2 text-6xl font-bold text-pink-400 opacity-0 pointer-events-none"
          style={{ opacity: useTransform(x, [-10, 10], [0, 0]) }}
        >
          MARRY
        </motion.div>
      </div>
    </motion.div>
  );
}
