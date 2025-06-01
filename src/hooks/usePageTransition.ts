'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function usePageTransition() {
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const navigateTo = (href: string, transitionDelay: number = 300) => {
    setIsTransitioning(true);
    
    // Wait for exit animation to finish before navigation
    setTimeout(() => {
      router.push(href);
      // Reset state after navigation
      setTimeout(() => {
        setIsTransitioning(false);
      }, 100);
    }, transitionDelay);
  };

  return {
    navigateTo,
    isTransitioning
  };
} 