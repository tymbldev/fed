interface ReferralStatusBadgeProps {
  status?: string | null;
}

export default function ReferralStatusBadge({ status }: ReferralStatusBadgeProps) {
  if (!status) return null;
  return (
    <span className="ml-2 px-2 py-1 rounded bg-blue-100 text-blue-800 text-xs font-medium">
      {status}
    </span>
  );
}