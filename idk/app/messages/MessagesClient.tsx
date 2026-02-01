'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { User } from '@/lib/data';
import { formatDistanceToNow } from 'date-fns';

interface Conversation {
  user: User;
  lastMessage: string;
  timestamp: Date;
  unread: boolean;
}

interface MessagesClientProps {
  conversations: Conversation[];
}

export default function MessagesClient({ conversations }: MessagesClientProps) {
  if (conversations.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary-500/20 to-purple-600/20 flex items-center justify-center">
            <svg className="w-12 h-12 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">No messages yet</h3>
          <p className="text-white/60 mb-6">
            Match with someone to start chatting!
          </p>
          <Link
            href="/"
            className="inline-block px-8 py-4 bg-gradient-to-r from-primary-500 to-purple-600 rounded-full font-semibold shadow-lg"
          >
            Start Swiping
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="divide-y divide-white/5">
        {conversations.map((conversation, index) => (
          <motion.div
            key={conversation.user.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link href={`/messages/${conversation.user.id}`}>
              <div className="flex items-center gap-4 px-6 py-4 hover:bg-white/5 transition-colors cursor-pointer">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-white/10">
                    <Image
                      src={conversation.user.photos[0]}
                      alt={conversation.user.name}
                      width={64}
                      height={64}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  {conversation.user.isOnline && (
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 rounded-full border-2 border-dark-950" />
                  )}
                  {conversation.unread && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold">1</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between mb-1">
                    <h3 className={`font-semibold ${conversation.unread ? 'text-white' : 'text-white/80'}`}>
                      {conversation.user.name}
                    </h3>
                    <span className="text-xs text-white/40">
                      {formatDistanceToNow(conversation.timestamp, { addSuffix: true })}
                    </span>
                  </div>
                  <p className={`text-sm truncate ${conversation.unread ? 'text-white font-medium' : 'text-white/60'}`}>
                    {conversation.lastMessage}
                  </p>
                </div>

                {/* Arrow */}
                <svg
                  className="w-5 h-5 text-white/40 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* New match prompt */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mx-6 mt-8 glass p-6 rounded-2xl text-center"
      >
        <h3 className="font-semibold mb-2">Keep matching!</h3>
        <p className="text-sm text-white/60 mb-4">
          Discover more people and start new conversations
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-gradient-to-r from-primary-500 to-purple-600 rounded-full text-sm font-semibold shadow-lg"
        >
          Discover More
        </Link>
      </motion.div>
    </div>
  );
}
