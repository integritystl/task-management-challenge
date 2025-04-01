'use client';

import { JSX, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

/**
 * Custom 404 page that automatically redirects to the home page
 * @returns A loading component while redirecting
 */
export default function NotFound(): JSX.Element {
  const router = useRouter();
  useEffect(() => {
    const redirectTimeout = setTimeout(() => {
      router.replace('/');
    }, 3000);
    return () => clearTimeout(redirectTimeout);
  }, [router]);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="flex flex-col items-center justify-center w-full py-12">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Whoops! This Page doesn&apos;t exist
        </h1>
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground text-center">Taking you back home...</p>
      </div>
    </div>
  );
}
