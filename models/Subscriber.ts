import mongoose, { Document, Schema } from 'mongoose';

export interface ISubscriber extends Document {
  email: string;
  subscribedAt: Date;
  isActive: boolean;
  source?: string;
}

const SubscriberSchema: Schema = new Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  subscribedAt: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  source: {
    type: String,
    default: 'website'
  }
}, {
  timestamps: true
});

// Create indexes for better performance
SubscriberSchema.index({ email: 1 });
SubscriberSchema.index({ subscribedAt: -1 });
SubscriberSchema.index({ isActive: 1 });

export default mongoose.models.Subscriber || mongoose.model<ISubscriber>('Subscriber', SubscriberSchema);


