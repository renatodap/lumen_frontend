import type { Metadata } from 'next';
import '../styles/globals.css';
import '../styles/design-system.css';
import '../styles/fonts.css';

export const metadata: Metadata = {
  title: 'LUMEN - Personal Operating System Enforcer',
  description: 'Win every day. Your personal operating system enforcer.',
  manifest: '/manifest.json',
  themeColor: '#FFFFFF',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-white text-black antialiased">{children}</body>
    </html>
  );
}
