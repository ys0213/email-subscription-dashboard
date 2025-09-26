import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '../../lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Test MongoDB connection
    await connectDB();
    
    res.status(200).json({ 
      message: 'API is working',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      mongodb_uri_set: !!process.env.MONGODB_URI
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({ 
      message: 'API error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
}
