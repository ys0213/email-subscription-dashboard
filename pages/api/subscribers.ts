import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '../../lib/mongodb';
import Subscriber from '../../models/Subscriber';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    return handleGet(req, res);
  } else if (req.method === 'PUT') {
    return handlePut(req, res);
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}

async function handleGet(req: NextApiRequest, res: NextApiResponse) {

  try {
    await connectDB();

    const { page = 1, limit = 10, search = '', sort = 'subscribedAt', order = 'desc' } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Build search query
    const searchQuery = search 
      ? { email: { $regex: search as string, $options: 'i' } }
      : {};

    // Build sort object
    const sortObj: any = {};
    sortObj[sort as string] = order === 'desc' ? -1 : 1;

    // Get subscribers with pagination
    const subscribers = await Subscriber.find(searchQuery)
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum)
      .select('email subscribedAt isActive')
      .lean();

    // Get total count for pagination
    const total = await Subscriber.countDocuments(searchQuery);

    // Get stats
    const totalSubscribers = await Subscriber.countDocuments({ isActive: true });
    const recentSignups = await Subscriber.countDocuments({
      isActive: true,
      subscribedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } // Last 7 days
    });

    const AllSubscribers = await Subscriber.countDocuments();
    const ActiveSubscribersRate = totalSubscribers/AllSubscribers*100;

    res.status(200).json({
      subscribers,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      },
      stats: {
        totalSubscribers,
        recentSignups,
        ActiveSubscribersRate
      }
    });

  } catch (error) {
    console.error('Fetch subscribers error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function handlePut(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectDB();

    const { id, isActive } = req.body;

    if (!id || typeof isActive !== 'boolean') {
      return res.status(400).json({ message: 'Invalid request data' });
    }

    const updatedSubscriber = await Subscriber.findByIdAndUpdate(
      id,
      { isActive },
      { new: true }
    ).select('email subscribedAt isActive').lean();

    if (!updatedSubscriber) {
      return res.status(404).json({ message: 'Subscriber not found' });
    }

    res.status(200).json({
      message: 'Subscriber status updated successfully',
      subscriber: updatedSubscriber
    });

  } catch (error) {
    console.error('Update subscriber error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}


