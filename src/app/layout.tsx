import './globals.css';
import { Inter } from 'next/font/google';
import TransitionLayout from '@/components/TransitionLayout';
import { metadata } from './metadata';
import LayoutWrapper from '@/components/LayoutWrapper';
import preloadModels from '@/lib/preloadModels';

const inter = Inter({ subsets: ['latin'] });

// Preload models at app startup
try {
  console.log('Preloading models from root layout...');
  preloadModels().catch(e => {
    console.error('Error preloading models from layout:', e);
  });
} catch (e) {
  console.error('Error in model preload setup:', e);
}

export { metadata };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-900 min-h-screen flex flex-col`}>
        <TransitionLayout>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </TransitionLayout>
      </body>
    </html>
  );
}
