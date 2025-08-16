import ReferralsListing from './Listing';

export default function ReferralsPage(props: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  return ReferralsListing(props);
}