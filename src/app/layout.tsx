import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';
import Header from './components/Header';
import Footer from './components/Footer';
import BottomNav from './components/BottomNav';
import { ThemeProvider } from './context/ThemeContext';
import ClientAuthProvider from './components/ClientAuthProvider';
import { getServerAuthState } from './utils/serverAuth';

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
      <body className={`${inter.className} bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200`}>
        <ClientAuthProvider initialAuthState={authState}>
          <ThemeProvider>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-grow pb-20 md:pb-0">
                {children}
              </main>
              <Footer />
              <BottomNav />
            </div>
            <Toaster position="top-right" />
          </ThemeProvider>
        </ClientAuthProvider>
      </body>
    </html>
  );
}