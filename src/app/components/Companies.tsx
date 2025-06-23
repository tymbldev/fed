'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Company {
  id: number;
  name: string;
  logoUrl: string;
}

const Companies = () => {
  const [companies, setCompanies] = useState<Company[]>([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await fetch('/api/v1/companies');
        if (res.ok) {
          const data = await res.json();
          setCompanies(data);
        } else {
          console.error('Failed to fetch companies');
        }
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    };

    fetchCompanies();
  }, []);

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="py-8 lg:py-16 mx-auto max-w-screen-xl px-4">
        <div className="text-center mb-8">
          <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
            Get referred by employees from 1000+ companies
          </h2>
          <div className="inline-block bg-green-100 text-green-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
            <svg
              className="w-4 h-4 inline-block mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              ></path>
            </svg>
            433 successful referrals last month
          </div>
          <p className="font-light text-gray-500 sm:text-xl dark:text-gray-400 mt-4">
            Employees get paid to refer top talent like you. Our network is thousands strong and growing.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8 text-gray-500 sm:gap-12 md:grid-cols-3 lg:grid-cols-6 dark:text-gray-400">
          {companies.map((company) => (
            <Link key={company.id} href={`/companies/${company.id}`}>
              <div className="flex items-center justify-center flex-col hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors cursor-pointer">
                <div className="w-24 h-24 mb-2 p-4 rounded-lg shadow-md bg-white flex items-center justify-center">
                  <Image
                    src={company.logoUrl}
                    alt={`${company.name} logo`}
                    width={64}
                    height={64}
                    className="object-contain"
                  />
                </div>
                <span className="text-sm font-semibold">{company.name}</span>
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-12">
            <Link href="/companies" legacyBehavior>
                <a className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900">
                    View all companies
                </a>
            </Link>
        </div>
      </div>
    </section>
  );
};

export default Companies;