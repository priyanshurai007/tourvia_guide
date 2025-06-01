'use client';

import React, { ReactNode } from 'react';
import usePageTransition from '@/hooks/usePageTransition';

type TransitionLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  delay?: number;
  onClick?: () => void;
};

export default function TransitionLink({
  href,
  children,
  className = '',
  delay = 300,
  onClick,
}: TransitionLinkProps) {
  const { navigateTo, isTransitioning } = usePageTransition();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onClick) onClick();
    
    navigateTo(href, delay);
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className={`${className} ${isTransitioning ? 'pointer-events-none' : ''}`}
      aria-disabled={isTransitioning}
    >
      {children}
    </a>
  );
} 