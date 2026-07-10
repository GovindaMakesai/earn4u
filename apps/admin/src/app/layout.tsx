import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Earn4U Admin',
  description: 'Earn4U Platform Administration',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
