import React, { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import StatCard from '../components/StatCard';
import SubscriberTable from '../components/SubscriberTable';

interface Subscriber {
  _id: string;
  email: string;
  subscribedAt: string;
  isActive: boolean;
}

interface DashboardStats {
  totalSubscribers: number;
  recentSignups: number;
  ActiveSubscribersRate: number;
}

interface SubscribersResponse {
  subscribers: Subscriber[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  stats: DashboardStats;
}

const Dashboard: React.FC = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [stats, setStats] = useState<DashboardStats>({ totalSubscribers: 0, recentSignups: 0, ActiveSubscribersRate: 0 });
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchSubscribers = useCallback(async (page: number = 1, search: string = '') => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(search && { search })
      });

      const response = await fetch(`/api/subscribers?${params}`);
      const data: SubscribersResponse = await response.json();

      if (response.ok) {
        setSubscribers(data.subscribers);
        setStats(data.stats);
        setCurrentPage(data.pagination.page);
        setTotalPages(data.pagination.pages);
        setTotal(data.pagination.total);
      } else {
        console.error('Failed to fetch subscribers:', data);
      }
    } catch (error) {
      console.error('Error fetching subscribers:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscribers();
  }, [fetchSubscribers]);

  const handleSearch = useCallback((search: string) => {
    setSearchTerm(search);
    setCurrentPage(1);
    fetchSubscribers(1, search);
  }, [fetchSubscribers]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    fetchSubscribers(page, searchTerm);
  }, [searchTerm, fetchSubscribers]);

  const handleToggleStatus = useCallback(async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch('/api/subscribers', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          isActive: !currentStatus
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update subscriber status');
      }

      // Refresh the current page to get updated data
      await fetchSubscribers(currentPage, searchTerm);
    } catch (error) {
      console.error('Error toggling subscriber status:', error);
      // You could add a toast notification here to show the error to the user
      throw error; // Re-throw so the SubscriberTable can handle it
    }
  }, [currentPage, searchTerm, fetchSubscribers]);

  return (
    <>
      <Head>
        <title>Dashboard - Email Subscription Manager</title>
        <meta name="description" content="Manage your email subscribers" />
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Email Subscription Manager</h1>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <Link
                  href="/"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Back to Subscription
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Manage and monitor your email subscribers
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <StatCard
              title="Total Subscribers"
              value={stats.totalSubscribers.toLocaleString()}
              change="+12.5%"
              changeType="increase"
              color="blue"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              }
            />
            <StatCard
              title="Recent Signups"
              value={stats.recentSignups.toLocaleString()}
              change="+8.2%"
              changeType="increase"
              color="green"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <StatCard
              title="Active Rate"
              value={stats.ActiveSubscribersRate.toLocaleString()+"%"}
              change="+0.3%"
              changeType="increase"
              color="purple"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
          </div>

          {/* Subscribers Table */}
          <SubscriberTable
            subscribers={subscribers}
            loading={loading}
            onSearch={handleSearch}
            onPageChange={handlePageChange}
            onToggleStatus={handleToggleStatus}
            currentPage={currentPage}
            totalPages={totalPages}
            total={total}
          />
        </main>
      </div>
    </>
  );
};

export default Dashboard;
