import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

async function testConnection() {
  const prisma = new PrismaClient();

  try {
    console.log('Connecting to MongoDB Atlas...');
    await prisma.$connect();
    console.log('Successfully connected to MongoDB Atlas!');
    const conversationCount = await prisma.conversation.count();
    console.log(`Found ${conversationCount} conversations`);
    await prisma.$disconnect();
    console.log('Disconnected from MongoDB Atlas');
  } catch (error) {
    console.error('Connection failed:', error);
    process.exit(1);
  }
}

testConnection();