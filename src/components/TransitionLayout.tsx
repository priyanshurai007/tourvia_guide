'use client';

import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { ReactNode, useEffect, useState } from 'react';

type TransitionLayoutProps = {
  children: ReactNode;
};

export default function TransitionLayout({ children }: TransitionLayoutProps) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    // Show loading indicator
    setIsLoading(true);
    
    // Hide loading indicator after a short delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [pathname]);
  
  return (
    <>
      {/* Loading indicator */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col items-center space-y-4">
              <div className="relative h-14 w-14">
                <div className="absolute inset-0 rounded-full border-4 border-t-orange-600 border-r-transparent border-b-gray-600 border-l-transparent animate-spin"></div>
              </div>
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-white text-xl font-medium"
              >
                Loading...
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Page Content with Animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </>
  );
} 