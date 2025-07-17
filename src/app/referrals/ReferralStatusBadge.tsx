"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { BASE_URL } from "../services/api";

interface ReferralStatusBadgeProps {
  jobId: number;
}

interface AppliedReferral {
  id: number;
  jobId: number;
  referralTitle: string;
  applicantId: number;
  applicantName: string;
  status: string;
  createdAt: string;
  jobReferrerId?: number;
  referrerName?: string;
  referrerDesignation?: string;
}

export default function ReferralStatusBadge({ jobId }: ReferralStatusBadgeProps) {
  const { isLoggedIn } = useAuth();
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoggedIn) return;
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('auth_token='))
      ?.split('=')[1];
    if (!token) return;
    fetch(`${BASE_URL}/api/v1/my-applications`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.ok ? res.json() : [])
      .then((data: AppliedReferral[]) => {
        const found = Array.isArray(data) ? data.find((r) => r.jobId === jobId) : null;
        setStatus(found?.status || null);
      })
      .catch(() => setStatus(null));
  }, [isLoggedIn, jobId]);

  if (!isLoggedIn || !status) return null;
  return (
    <span className="ml-2 px-2 py-1 rounded bg-blue-100 text-blue-800 text-xs font-medium">
      {status}
    </span>
  );
}