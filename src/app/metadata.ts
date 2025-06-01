import { Metadata } from 'next';

// Static metadata
export const metadata: Metadata = {
  title: 'Find Your Best Guide | Authentic Travel Experiences',
  description: 'Connect with local guides for authentic travel experiences around the world.',
  keywords: ['travel', 'local guides', 'tours', 'authentic experiences'],
  authors: [{ name: 'Find Your Best Guide Team' }],
  creator: 'Find Your Best Guide',
  publisher: 'Find Your Best Guide',
  openGraph: {
    title: 'Find Your Best Guide | Authentic Travel Experiences',
    description: 'Connect with local guides for authentic travel experiences around the world.',
    url: 'https://findyourbestguide.com',
    siteName: 'Find Your Best Guide',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Find Your Best Guide - Authentic Travel Experiences',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Find Your Best Guide | Authentic Travel Experiences',
    description: 'Connect with local guides for authentic travel experiences around the world.',
    images: ['/images/twitter-image.jpg'],
  },
  icons: {
    icon: '/favicon.ico',
    apple: [
      { url: '/apple-icon.png' },
    ],
  },
}; 