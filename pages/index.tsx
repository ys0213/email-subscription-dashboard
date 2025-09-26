import React from 'react';
import Head from 'next/head';
import EmailSubscriptionForm from '../components/EmailSubscriptionForm';

const Home: React.FC = () => {
  return (
    <>
      <Head>
        <title>Email Subscription - Stay Updated</title>
        <meta name="description" content="Subscribe to our newsletter for the latest updates" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 bg-primary-600 rounded-full mb-4">
              <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Newsletter Subscription</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Join thousands of subscribers who get our latest updates
            </p>
          </div>
          
          <EmailSubscriptionForm />
        </div>
      </div>
    </>
  );
};

export default Home;


