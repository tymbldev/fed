import GlobalMetaHead from './components/seo/GlobalMetaHead';

export default function Head() {
  return (
    <GlobalMetaHead
      title="TymblHub - Referral Platform"
      description="Find your dream opportunity or refer talented professionals to top companies."
      canonicalUrl="https://tymblhub.com/"
      robots="index,follow"
      og={{
        title: 'TymblHub - Referral Platform',
        description: 'Find your dream opportunity or refer talented professionals to top companies.',
        url: 'https://tymblhub.com/',
        image: '/logo.png',
        siteName: 'TymblHub',
        type: 'website',
      }}
      includeLegacyDefaults
    />
  );
}


