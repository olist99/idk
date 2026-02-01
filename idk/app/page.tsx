import DiscoverClient from './DiscoverClient';
import { getRandomUsers } from '@/lib/data';
import Navigation from '@/components/Navigation';

// This is a Server Component with SSR
export default async function DiscoverPage() {
  // Fetch users on the server
  const users = getRandomUsers(8);

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 glass-dark border-b border-white/10">
        <div className="max-w-lg mx-auto px-6 py-4">
          <h1 className="text-2xl font-display font-bold gradient-text text-center">
            Snog
          </h1>
        </div>
      </header>

      {/* Main content */}
      <main className="pt-20 px-4">
        <DiscoverClient initialUsers={users} />
      </main>

      <Navigation />
    </div>
  );
}
