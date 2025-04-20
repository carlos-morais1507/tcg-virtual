'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';

export default function PerfilLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      if (!user) {
        router.push('/login');
      }
    });

    return () => unsub();
  }, [router]);

  return <>{children}</>;
}
