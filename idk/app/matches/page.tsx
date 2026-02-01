import MatchesClient from './MatchesClient';
import { mockUsers } from '@/lib/data';
import Navigation from '@/components/Navigation';

export default async function MatchesPage() {
  // In a real app, this would fetch the user's matches from a database
  const matches = mockUsers.slice(0, 4);

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 glass-dark border-b border-white/10">
        <div className="max-w-lg mx-auto px-6 py-4">
          <h1 className="text-2xl font-display font-bold gradient-text text-center">
            Matches
          </h1>
        </div>
      </header>

      {/* Main content */}
      <main className="pt-20">
        <MatchesClient initialMatches={matches} />
      </main>

      <Navigation />
    </div>
  );
}
