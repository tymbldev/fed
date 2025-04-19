'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';

interface Job {
  id: number;
  title: string;
  description: string;
  location: string;
  employmentType: string;
  experienceLevel: string;
  salary: number;
  currency: string;
  createdAt: string;
}

export default function MyJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchJobs = async (page: number) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/v1/jobsmanagement/my-posts?page=${page}&size=10`);
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
    fetchJobs(currentPage);
  }, [currentPage]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatSalary = (salary: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
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
                          <span className="truncate">{job.location}</span>
                          <span className="mx-2">•</span>
                          <span>{job.employmentType}</span>
                          <span className="mx-2">•</span>
                          <span>{job.experienceLevel}</span>
                          <span className="mx-2">•</span>
                          <span>{formatSalary(job.salary, job.currency)}</span>
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