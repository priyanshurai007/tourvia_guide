'use client';

import { useEffect, useState } from 'react';

type DateDisplayProps = {
  date: string;
  format?: 'date' | 'datetime' | 'time';
  fallback?: string;
  className?: string;
};

/**
 * Utility function to format dates
 */
function formatDateForDisplay(
  dateString: string, 
  format: 'date' | 'datetime' | 'time' = 'date'
): string {
  if (!dateString) {
    return '';
  }

  try {
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return dateString;
    }
    
    const options: Intl.DateTimeFormatOptions = {};
    
    if (format === 'date' || format === 'datetime') {
      // Set date format options
      options.year = 'numeric';
      options.month = 'long';
      options.day = 'numeric';
    }
    
    if (format === 'time' || format === 'datetime') {
      // Set time format options
      options.hour = '2-digit';
      options.minute = '2-digit';
    }
    
    return new Intl.DateTimeFormat('en-US', options).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
}

/**
 * A component for displaying dates in a hydration-safe way
 * Renders the date client-side to prevent hydration errors
 */
export default function DateDisplay({ 
  date, 
  format = 'date', 
  fallback = '',
  className = '' 
}: DateDisplayProps) {
  const [formattedDate, setFormattedDate] = useState<string>('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    try {
      const formatted = formatDateForDisplay(date, format);
      setFormattedDate(formatted);
    } catch (error) {
      console.error('Error formatting date:', error);
      setFormattedDate(fallback || date);
    }
  }, [date, format, fallback]);

  // During server-side rendering, return a placeholder with the same appearance
  if (!isClient) {
    return (
      <span suppressHydrationWarning className={className}>
        {formatDateForDisplay(date, format)}
      </span>
    );
  }

  return (
    <span className={className}>
      {formattedDate || fallback || date}
    </span>
  );
} 