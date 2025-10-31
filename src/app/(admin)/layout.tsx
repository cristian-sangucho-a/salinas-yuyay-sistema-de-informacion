'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Permitir acceso a la página de login sin autenticación
    if (pathname === '/login') {
      return;
    }

    // Verificar autenticación para otras rutas admin
    if (!isAuthenticated()) {
      router.push('/login');
    }
  }, [pathname, router]);

  return <>{children}</>;
}
