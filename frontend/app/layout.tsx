import './globals.css';
import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import AuthGuard from './components/AuthGuard'; 

// import Plus Jakarta Sans font
const plusJakartaSans = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plus-jakarta',
});

export const metadata: Metadata = {
  title: 'BookNest',
};

// make sure user is authenticated before accessing any page
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={plusJakartaSans.className}>
        <AuthGuard>
          {children}
        </AuthGuard>
      </body>
    </html>
  );
}