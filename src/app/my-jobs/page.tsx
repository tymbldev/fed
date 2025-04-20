'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { BASE_URL } from '../services/api';

interface Job {
  id: number;
  title: string;
  description: string;
  cityId: number;
  company: string;
  companyId: number;
  countryId: number;
  currencyId: number;
  designation: string | null;
  designationId: number;
  salary: number;
  active: boolean;
  postedBy: number;
  createdAt: string;
  updatedAt: string;
}

interface Currency {
  id: number;
  code: string;
  name: string;
  symbol: string;
  exchangeRate: number;
  isActive: boolean;
}

export default function MyJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [currencies, setCurrencies] = useState<{ [key: number]: string }>({});
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCurrencies = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/v1/dropdowns/currencies`);
      if (!response.ok) {
        throw new Error('Failed to fetch currencies');
      }
      const data: Currency[] = await response.json();
      const currencyMap = data.reduce((acc, currency) => {
        acc[currency.id] = currency.code;
        return acc;
      }, {} as { [key: number]: string });
      setCurrencies(currencyMap);
    } catch (error) {
      console.error('Error fetching currencies:', error);
      toast.error('Failed to fetch currencies');
    }
  };

  const fetchJobs = async (page: number) => {
    try {
      setIsLoading(true);
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth_token='))
        ?.split('=')[1];
      const response = await fetch(`${BASE_URL}/api/v1/jobmanagement/my-posts?page=${page}&size=10`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch jobs');
      }
      const data = await response.json();
      setJobs(data.content);
      setTotalPages(data.totalPages);
    } catch (error) {
      toast.error('Failed to fetch jobs');
      console.error('Error fetching jobs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrencies();
    fetchJobs(currentPage);
  }, [currentPage]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatSalary = (salary: number, currencyId: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencies[currencyId] || 'USD',
    }).format(salary);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Posted Jobs</h1>
        <Link
          href="/post-job"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Post a New Job
        </Link>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading...</div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">You haven&apos;t posted any jobs yet.</p>
          <Link
            href="/post-job"
            className="mt-4 inline-flex items-center text-indigo-600 hover:text-indigo-500"
          >
            Post your first job
          </Link>
        </div>
      ) : (
        <>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {jobs.map((job) => (
                <li key={job.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <h2 className="text-xl font-semibold text-gray-900 truncate">
                          {job.title}
                        </h2>
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                          <span className="truncate">{job.company}</span>
                          <span className="mx-2">•</span>
                          <span>{job.designation || 'Not specified'}</span>
                          <span className="mx-2">•</span>
                          <span>{formatSalary(job.salary, job.currencyId)}</span>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <span className="text-sm text-gray-500">
                          Posted on {formatDate(job.createdAt)}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {job.description}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {totalPages > 1 && (
            <div className="mt-4 flex justify-center">
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))}
                  disabled={currentPage === 0}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      currentPage === i
                        ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))}
                  disabled={currentPage === totalPages - 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
}