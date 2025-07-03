import type { Metadata } from 'next';
import './globals.css';
import { UserProvider } from '@/lib/auth-context';
import { ToastProvider } from '@/components/toast';
import SetupBanner from '@/components/setup-banner';

export const metadata: Metadata = {
  title: 'ONE EDU - Voice-Driven Learning',
  description: 'Educational platform for children with voice-driven features',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body>
        <div id='root' className='min-h-screen'>
          <ToastProvider>
            <SetupBanner />
            <UserProvider>
              {children}
            </UserProvider>
          </ToastProvider>
        </div>
      </body>
    </html>
  );
}
