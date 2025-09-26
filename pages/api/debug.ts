import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Basic API test
    const debugInfo = {
      message: 'Debug endpoint is working',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      vercel: process.env.VERCEL,
      region: process.env.VERCEL_REGION,
      mongodb_uri_set: !!process.env.MONGODB_URI,
      mongodb_uri_length: process.env.MONGODB_URI?.length || 0,
      mongodb_uri_starts_with: process.env.MONGODB_URI?.substring(0, 20) || 'not set',
      node_version: process.version,
      platform: process.platform,
      arch: process.arch
    };

    // Test MongoDB connection
    try {
      const connectDB = (await import('../../lib/mongodb')).default;
      await connectDB();
      debugInfo.mongodb_connection = 'success';
    } catch (mongoError) {
      debugInfo.mongodb_connection = 'failed';
      debugInfo.mongodb_error = mongoError instanceof Error ? mongoError.message : 'Unknown error';
    }

    res.status(200).json(debugInfo);
  } catch (error) {
    console.error('Debug endpoint error:', error);
    res.status(500).json({ 
      message: 'Debug endpoint error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
}
