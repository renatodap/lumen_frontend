import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../styles/globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'LUMEN - Personal Operating System Enforcer',
  description: 'Production-ready personal operating system with AI-powered enforcement',
  manifest: '/manifest.json',
  themeColor: '#F5E6D3',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-bg-primary text-text-primary antialiased">{children}</body>
    </html>
  );
}
