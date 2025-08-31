// import { notFound } from 'next/navigation';

interface CompanyDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function CompanyDetailsPage({ params }: CompanyDetailsPageProps) {
  // const { id } = await params;

  // For now, redirect to the original company page
  // This maintains compatibility while we can enhance the UI later
  const CompanyPage = (await import(`../companies/[id]/page`)).default;

  return <CompanyPage params={params} />;
}
