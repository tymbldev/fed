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
  applicationCount?: number;
}

export default function MyJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchApplicationCounts = async (jobIds: number[]) => {
    try {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth_token='))
        ?.split('=')[1];

      const promises = jobIds.map(async (jobId) => {
        try {
          const response = await fetch(`${BASE_URL}/api/v1/job-applications/job/${jobId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            return { jobId, count: data.length || 0 };
          }
          return { jobId, count: 0 };
        } catch (error) {
          console.error(`Error fetching application count for job ${jobId}:`, error);
          return { jobId, count: 0 };
        }
      });

      const results = await Promise.all(promises);
      const countMap = results.reduce((acc, { jobId, count }) => {
        acc[jobId] = count;
        return acc;
      }, {} as { [key: number]: number });

      setJobs(prevJobs =>
        prevJobs.map(job => ({
          ...job,
          applicationCount: countMap[job.id] || 0
        }))
      );
    } catch (error) {
      console.error('Error fetching application counts:', error);
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

      // Fetch application counts for the jobs
      if (data.content.length > 0) {
        const jobIds = data.content.map((job: Job) => job.id);
        await fetchApplicationCounts(jobIds);
      }
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
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('en-US', { month: 'short' });
    const year = date.getFullYear().toString().slice(-2);

    const getDayWithOrdinal = (d: number) => {
      if (d > 3 && d < 21) return `${d}th`;
      switch (d % 10) {
        case 1:  return `${d}st`;
        case 2:  return `${d}nd`;
        case 3:  return `${d}rd`;
        default: return `${d}th`;
      }
    };

    return `${getDayWithOrdinal(day)} ${month} ${year}`;
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
          <div className="overflow-hidden">
            <ul>
              {jobs.map((job) => (
                <li key={job.id}>
                  <div className="p-4 border border-gray-200 rounded-lg mb-4 shadow-sm bg-white">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <h2 className="text-lg font-bold text-gray-800 truncate">
                          <Link href={`/my-jobs/${job.id}`} className="hover:underline">
                            {job.title}
                          </Link>
                        </h2>
                        <div className="mt-1 text-sm text-gray-500">
                          <span>Company: {job.company}</span>
                          <span className="mx-2">|</span>
                          <span>Posted by: me on {formatDate(job.createdAt)}</span>
                        </div>
                        <div className="mt-3 flex items-center">
                          <Link href={`/my-jobs/${job.id}`} className="hover:underline">
                            <span className="text-sm font-semibold text-gray-700">
                              {job.applicationCount || 0} Total Responses
                            </span>
                          </Link>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <Link
                          href={`/post-job?edit=true&id=${job.id}`}
                          className="text-indigo-600 hover:text-indigo-500 font-medium"
                        >
                          Edit Job
                        </Link>
                      </div>
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