'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import Header from '@/components/sme/Header';
import MainNavigation from '@/components/sme/MainNavigation';

export default function SMELayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-white">
      {children}
    </div>
  );
}
