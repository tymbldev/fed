import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { Toaster } from 'sonner';
import Header from './components/Header';
import Footer from './components/Footer';
import BottomNav from './components/BottomNav';
import { ThemeProvider } from './context/ThemeContext';
import { SearchModalProvider } from './context/SearchModalContext';
import ClientAuthProvider from './components/ClientAuthProvider';
import GlobalSearchModalWrapper from './components/GlobalSearchModalWrapper';
import { getServerAuthState } from './utils/serverAuth';
// import CacheManager from './components/CacheManager';

// Force dynamic rendering for all routes since we use cookies for authentication
export const dynamic = 'force-dynamic';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TymblHub - Referral Platform',
  description: 'Find your dream opportunity or refer talented professionals to top companies.',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Get auth state on the server
  const authState = await getServerAuthState();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-WFGL6NX08T"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-WFGL6NX08T');
          `}
        </Script>
      </head>
      <body className={`${inter.className} bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200`}>
        <ClientAuthProvider initialAuthState={authState}>
          <ThemeProvider>
            <SearchModalProvider>
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-grow pb-20 md:pb-0">
                  {children}
                </main>
                <Footer />
                <BottomNav />
              </div>
              <Toaster position="top-right" />
              <GlobalSearchModalWrapper />
              {/* <CacheManager /> */}
            </SearchModalProvider>
          </ThemeProvider>
        </ClientAuthProvider>
      </body>
    </html>
  );
}