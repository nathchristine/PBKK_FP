"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname(); 
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const publicPaths = ['/login', '/signup'];
    
    // if current path is public, allow access
    if (publicPaths.includes(pathname)) {
      setAuthorized(true);
      return;
    }

    // check for user role in local storage
    const userRole = localStorage.getItem('userRole');

    // if no role found, redirect to login
    if (!userRole) {
      router.push('/login');
    } else {
      setAuthorized(true);
    }
  }, [pathname, router]);

  // while checking authorization, don't render anything
  if (!authorized) {
    return null;
  }

  // render page only if authorized
  return <>{children}</>;
}