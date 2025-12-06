'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/lib/oauthservice';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { AutomatedReportView } from '@/components/AutomatedReportView';

export default function DiagnosisPage() {
  const router = useRouter();

  useEffect(() => {
    if (!AuthService.isAuthenticated()) {
      router.push('/');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-white">
      <Header onLoginClick={() => { }} />

      <div className="pt-[144px]">
        <AutomatedReportView />
      </div>

      <Footer />
    </div>
  );
}

