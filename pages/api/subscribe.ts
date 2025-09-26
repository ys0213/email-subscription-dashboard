import { NextApiRequest, NextApiResponse } from 'next';
import connectDB from '../../lib/mongodb';
import Subscriber from '../../models/Subscriber';
import emailjs from '@emailjs/browser';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();

    const { email } = req.body;

    // Validate email
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ message: 'Email is required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please enter a valid email address' });
    }

    // Check if email already exists
    const existingSubscriber = await Subscriber.findOne({ email: email.toLowerCase() });
    if (existingSubscriber) {
      return res.status(409).json({ message: 'Email already subscribed' });
    }

    // Create new subscriber
    const subscriber = new Subscriber({
      email: email.toLowerCase(),
      subscribedAt: new Date(),
      isActive: true,
      source: 'website'
    });

    await subscriber.save();

    // Send confirmation email using EmailJS (optional)
    if (process.env.EMAILJS_SERVICE_ID && process.env.EMAILJS_TEMPLATE_ID && process.env.EMAILJS_PUBLIC_KEY) {
      try {
        emailjs.init(process.env.EMAILJS_PUBLIC_KEY);
        
        const templateParams = {
          to_email: email,
          from_name: 'Newsletter Team',
          message: 'Thank you for subscribing to our newsletter!',
          reply_to: email,
        };

        await emailjs.send(
          process.env.EMAILJS_SERVICE_ID,
          process.env.EMAILJS_TEMPLATE_ID,
          templateParams
        );
      } catch (emailError) {
        console.error('EmailJS error:', emailError);
        // Don't fail the subscription if email sending fails
      }
    }

    res.status(201).json({ 
      message: 'Successfully subscribed!',
      subscriber: {
        id: subscriber._id,
        email: subscriber.email,
        subscribedAt: subscriber.subscribedAt
      }
    });

  } catch (error) {
    console.error('Subscription error:', error);
    res.status(500).json({ message: 'Internal server error', error: error });
  }
}


