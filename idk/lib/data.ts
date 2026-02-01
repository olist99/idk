export interface User {
  id: string;
  name: string;
  age: number;
  location: string;
  bio: string;
  interests: string[];
  photos: string[];
  avatar: string;
  isOnline: boolean;
  lastSeen?: Date;
}

export interface Match {
  userId: string;
  type: 'snog' | 'marry' | 'avoid';
  timestamp: Date;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

// Mock user data for demonstration
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Sophie',
    age: 24,
    location: 'London',
    bio: 'Coffee enthusiast ☕ | Travel addict ✈️ | Love dogs more than people 🐕',
    interests: ['Travel', 'Photography', 'Coffee', 'Dogs', 'Music Festivals'],
    photos: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&q=80',
    ],
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie',
    isOnline: true,
  },
  {
    id: '2',
    name: 'James',
    age: 27,
    location: 'Manchester',
    bio: 'Fitness junkie 💪 | Foodie 🍕 | Looking for adventure and good vibes',
    interests: ['Fitness', 'Cooking', 'Hiking', 'Gaming', 'Movies'],
    photos: [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
    ],
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
    isOnline: false,
    lastSeen: new Date(Date.now() - 3600000),
  },
  {
    id: '3',
    name: 'Emma',
    age: 22,
    location: 'Birmingham',
    bio: 'Art student 🎨 | Book lover 📚 | Searching for meaningful connections',
    interests: ['Art', 'Reading', 'Museums', 'Indie Music', 'Writing'],
    photos: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80',
    ],
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
    isOnline: true,
  },
  {
    id: '4',
    name: 'Oliver',
    age: 26,
    location: 'Liverpool',
    bio: 'Music producer 🎵 | Festival goer | Living life one beat at a time',
    interests: ['Music Production', 'DJing', 'Festivals', 'Nightlife', 'Fashion'],
    photos: [
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=80',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&q=80',
    ],
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver',
    isOnline: false,
    lastSeen: new Date(Date.now() - 7200000),
  },
  {
    id: '5',
    name: 'Mia',
    age: 23,
    location: 'Bristol',
    bio: 'Yoga instructor 🧘‍♀️ | Vegan chef 🌱 | Spreading good energy everywhere',
    interests: ['Yoga', 'Cooking', 'Meditation', 'Nature', 'Wellness'],
    photos: [
      'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&q=80',
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&q=80',
    ],
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mia',
    isOnline: true,
  },
  {
    id: '6',
    name: 'Liam',
    age: 25,
    location: 'Leeds',
    bio: 'Software engineer 💻 | Gamer 🎮 | Pizza is life 🍕',
    interests: ['Gaming', 'Coding', 'Pizza', 'Sci-Fi', 'Tech'],
    photos: [
      'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=800&q=80',
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&q=80',
    ],
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Liam',
    isOnline: true,
  },
  {
    id: '7',
    name: 'Charlotte',
    age: 21,
    location: 'Newcastle',
    bio: 'Fashion blogger 👗 | Makeup artist 💄 | Always chasing the next trend',
    interests: ['Fashion', 'Makeup', 'Shopping', 'Photography', 'Social Media'],
    photos: [
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80',
      'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=800&q=80',
    ],
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlotte',
    isOnline: false,
    lastSeen: new Date(Date.now() - 10800000),
  },
  {
    id: '8',
    name: 'Noah',
    age: 28,
    location: 'Edinburgh',
    bio: 'Professional photographer 📸 | Adventure seeker | Capturing moments',
    interests: ['Photography', 'Travel', 'Adventure', 'Nature', 'Documentaries'],
    photos: [
      'https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=800&q=80',
      'https://images.unsplash.com/photo-1545996124-0501ebae84d0?w=800&q=80',
    ],
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Noah',
    isOnline: true,
  },
];

export function getRandomUsers(count: number = 5): User[] {
  const shuffled = [...mockUsers].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export function getUserById(id: string): User | undefined {
  return mockUsers.find(user => user.id === id);
}
