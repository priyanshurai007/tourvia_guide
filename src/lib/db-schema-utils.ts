import { MongoClient, Db, ObjectId } from 'mongodb';

// Define collection schema types
export interface UserDocument {
  _id: ObjectId | string;
  name: string;
  email: string;
  password: string;
  role: 'traveler' | 'guide' | 'admin';
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BookingDocument {
  _id: ObjectId | string;
  userId: string;
  guideId?: string;
  tourId?: string;
  tourName: string;
  guideName: string;
  location: string;
  date: string;
  time: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Canceled';
  image?: string;
  hasReviewed: boolean;
  price?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SavedGuideDocument {
  _id: ObjectId | string;
  userId: string;
  guideId: string;
  name: string;
  location: string;
  rating: number;
  specialty: string;
  image?: string;
  createdAt: Date;
}

export interface TourDocument {
  _id: ObjectId | string;
  title: string;
  description: string;
  guideId: string;
  guideName: string;
  location: string;
  price: number;
  duration: string;
  image?: string;
  rating?: number;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Function to initialize collections with proper indexes if they don't exist
export async function initializeCollections(db: Db): Promise<void> {
  const collections = await db.listCollections().toArray();
  const collectionNames = collections.map(c => c.name);

  // Initialize Users collection if it doesn't exist
  if (!collectionNames.includes('users')) {
    console.log('Creating users collection...');
    await db.createCollection('users');
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    console.log('Created users collection with email index');
  }

  // Initialize Bookings collection if it doesn't exist
  if (!collectionNames.includes('bookings')) {
    console.log('Creating bookings collection...');
    await db.createCollection('bookings');
    await db.collection('bookings').createIndex({ userId: 1 });
    await db.collection('bookings').createIndex({ guideId: 1 });
    await db.collection('bookings').createIndex({ date: 1 });
    console.log('Created bookings collection with indexes');
  }

  // Initialize Saved Guides collection if it doesn't exist
  if (!collectionNames.includes('saved_guides')) {
    console.log('Creating saved_guides collection...');
    await db.createCollection('saved_guides');
    await db.collection('saved_guides').createIndex({ userId: 1 });
    await db.collection('saved_guides').createIndex({ userId: 1, guideId: 1 }, { unique: true });
    console.log('Created saved_guides collection with indexes');
  }

  // Initialize Tours collection if it doesn't exist
  if (!collectionNames.includes('tours')) {
    console.log('Creating tours collection...');
    await db.createCollection('tours');
    await db.collection('tours').createIndex({ guideId: 1 });
    await db.collection('tours').createIndex({ location: 1 });
    await db.collection('tours').createIndex({ title: 'text', description: 'text' });
    console.log('Created tours collection with indexes');
  }
}

// Helper to ensure we have a proper MongoDB connection
let cachedClient: MongoClient | null = null;

export async function connectToDatabase(): Promise<{ client: MongoClient, db: Db }> {
  if (cachedClient) {
    return { client: cachedClient, db: cachedClient.db() };
  }

  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is not defined');
  }

  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    cachedClient = client;

    const db = client.db();

    // Initialize collections on first connection
    await initializeCollections(db);

    return { client, db };
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
}

// Helper to create demo data for testing if needed
export async function createDemoDataIfEmpty(db: Db): Promise<void> {
  // Only add demo data if the collections are empty
  const usersCount = await db.collection('users').countDocuments();

  if (usersCount === 0) {
    console.log('Creating demo user accounts...');

    // Create a demo traveler
    const salt = await import('bcryptjs').then(bcrypt => bcrypt.genSalt(10));
    const hashPassword = await import('bcryptjs').then(bcrypt => bcrypt.hash('password123', salt));

    await db.collection('users').insertMany([
      {
        name: 'Demo Traveler',
        email: 'traveler@example.com',
        password: hashPassword,
        role: 'traveler',
        avatar: 'https://ui-avatars.com/api/?name=Demo+Traveler&background=random',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Demo Guide',
        email: 'guide@example.com',
        password: hashPassword,
        role: 'guide',
        avatar: 'https://ui-avatars.com/api/?name=Demo+Guide&background=random',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashPassword,
        role: 'admin',
        avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=random',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    console.log('Demo users created');

    // We could add demo bookings, tours, etc. here as well
  }
} 