import Navigation from '@/components/Navigation';
import { mockUsers } from '@/lib/data';
import MessagesClient from './MessagesClient';

export default async function MessagesPage() {
  // In a real app, fetch conversations from database
  const conversations = mockUsers.slice(0, 5).map((user, idx) => ({
    user,
    lastMessage: idx === 0 
      ? "Hey! How are you? 😊"
      : idx === 1 
      ? "That sounds amazing!"
      : idx === 2
      ? "When are you free to meet?"
      : idx === 3
      ? "Haha that's so funny! 😂"
      : "Thanks for the match!",
    timestamp: new Date(Date.now() - idx * 3600000),
    unread: idx < 2,
  }));

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 glass-dark border-b border-white/10">
        <div className="max-w-lg mx-auto px-6 py-4">
          <h1 className="text-2xl font-display font-bold gradient-text text-center">
            Messages
          </h1>
        </div>
      </header>

      {/* Main content */}
      <main className="pt-20">
        <MessagesClient conversations={conversations} />
      </main>

      <Navigation />
    </div>
  );
}
