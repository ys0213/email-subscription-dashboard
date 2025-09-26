import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '../../lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    console.log('Testing MongoDB connection...');
    await connectDB();
    console.log('MongoDB connected successfully!');
    
    res.status(200).json({ 
      message: 'MongoDB connection successful!',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('MongoDB connection error:', error);
    res.status(500).json({ 
      message: 'MongoDB connection failed',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}


