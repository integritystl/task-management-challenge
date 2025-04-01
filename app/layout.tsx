import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Fira_Code } from 'next/font/google';
import { Toaster } from '@/components/ui/toaster';

const firaCode = Fira_Code({ subsets: ['latin'], display: 'swap' });
export const metadata: Metadata = {
  title: 'Task Management Challenge',
  description: 'A task management challenge for javascript developers at IntegrityXD',
  keywords: ['task management', 'productivity', 'todo list', 'organization'],
  authors: [{ name: 'IntegrityXD' }],
  creator: 'IntegrityXD',
};
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
};
interface RootLayoutProps {
  children: React.ReactNode;
}
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={firaCode.className}>
        <div className="min-h-screen flex flex-col bg-background text-foreground">
          <main className="flex-grow">{children}</main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
