import React, { useState } from 'react';
import Link from 'next/link';
import emailjs from '@emailjs/browser';

interface FormData {
  email: string;
}

interface FormState {
  isLoading: boolean;
  isSubmitted: boolean;
  error: string | null;
}

const EmailSubscriptionForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({ email: '' });
  const [formState, setFormState] = useState<FormState>({
    isLoading: false,
    isSubmitted: false,
    error: null
  });

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const sendConfirmationEmail = async (email: string) => {
    try {
      // Initialize EmailJS with your public key
      emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '');
      
      const templateParams = {
        to_email: email,
        from_name: 'Newsletter Team',
        message: 'Thank you for subscribing to our newsletter! You will receive our latest updates and news.',
        reply_to: email,
        user_email: email,
        subscription_date: new Date().toLocaleDateString(),
      };

      // Send email using EmailJS
      const result = await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '',
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '',
        templateParams
      );

      console.log('Confirmation email sent successfully:', result);
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
      // Don't fail the subscription if email sending fails
      // The user is still subscribed to the database
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData({ email: value });
    // Clear error when user starts typing
    if (formState.error) {
      setFormState(prev => ({ ...prev, error: null }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate email
    if (!formData.email.trim()) {
      setFormState(prev => ({ ...prev, error: 'Email is required' }));
      return;
    }
    
    if (!validateEmail(formData.email)) {
      setFormState(prev => ({ ...prev, error: 'Please enter a valid email address' }));
      return;
    }

    setFormState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.log('Subscription failed:', result);
        throw new Error(result.error?.errors?.email?.message || result.message || 'Failed to subscribe');
      }

      console.log('Subscription successful:', result);
      
      // Send confirmation email using EmailJS
      await sendConfirmationEmail(formData.email);
      
      setFormState({
        isLoading: false,
        isSubmitted: true,
        error: null
      });
      
      // Reset form
      setFormData({ email: '' });
      
    } catch (error) {
      console.error('Subscription error:', error);
      setFormState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to subscribe. Please try again later.'
      }));
    }
  };

  if (formState.isSubmitted) {
    return (
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 mb-4">
            <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Successfully Subscribed!</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Thank you for subscribing! You'll receive our latest updates.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => setFormState(prev => ({ ...prev, isSubmitted: false }))}
              className="w-full text-blue-600 hover:text-blue-500 font-medium"
            >
              Subscribe another email
            </button>
            <Link
              href="/dashboard"
              className="block w-full text-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
            >
              View Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Stay Updated</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Subscribe to our newsletter for the latest news and updates.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email address"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            disabled={formState.isLoading}
          />
        </div>

        {formState.error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
            <p className="text-sm text-red-600 dark:text-red-400">{formState.error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={formState.isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {formState.isLoading ? (
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Subscribing...
            </div>
          ) : (
            'Subscribe'
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <Link
          href="/dashboard"
          className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
        >
          View Subscriber Dashboard →
        </Link>
      </div>
    </div>
  );
};

export default EmailSubscriptionForm;


