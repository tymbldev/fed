"use client";

import JobTuple from "../../components/JobTuple";
import { Job, LocationOption } from "../../utils/serverData";

interface CompanyJobsClientProps {
  jobs: Job[];
  locations: { [key: number]: LocationOption };
}

export default function CompanyJobsClient({ jobs, locations }: CompanyJobsClientProps) {
  if (!jobs || jobs.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 0V6a2 2 0 00-2-2H8a2 2 0 00-2 2v2m8 0v8a2 2 0 01-2 2H8a2 2 0 01-2-2V6" />
        </svg>
        <p className="text-lg">No open positions at the moment</p>
        <p className="text-sm">Check back later for new opportunities</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {jobs.map((job) => (
        <JobTuple
          key={job.id}
          id={job.id}
          title={job.title}
          description={job.description}
          company={job.company}
          cityId={job.cityId}
          minExperience={job.minExperience}
          maxExperience={job.maxExperience}
          openingCount={job.openingCount}
          createdAt={job.createdAt}
          locations={locations}
          applicationStatus={null}
        />
      ))}
    </div>
  );
}