'use client';

import { useState, useEffect } from 'react';

// Component to display formatted dates safely in Next.js
export function SafeDateDisplay({ 
  date, 
  format = 'date',
  fallback = '',
  className = '' 
}: {
  date: string | Date;
  format?: 'date' | 'datetime' | 'time';
  fallback?: string;
  className?: string;
}) {
  const [formattedDate, setFormattedDate] = useState<string>(fallback);
  
  useEffect(() => {
    try {
      const dateObj = date instanceof Date ? date : new Date(date);
      
      if (format === 'date') {
        // We'll use en-GB format to ensure consistency (DD/MM/YYYY)
        setFormattedDate(dateObj.toLocaleDateString('en-GB'));
      } else if (format === 'time') {
        setFormattedDate(dateObj.toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
        }));
      } else {
        // datetime format
        setFormattedDate(
          `${dateObj.toLocaleDateString('en-GB')} ${dateObj.toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
          })}`
        );
      }
    } catch (error) {
      console.error('Date formatting error:', error);
      setFormattedDate(fallback || String(date));
    }
  }, [date, format, fallback]);
  
  // Add suppressHydrationWarning to prevent hydration errors
  return (
    <span suppressHydrationWarning className={className}>
      {formattedDate}
    </span>
  );
}

// Server-side safe date formatter (uses fixed locale)
export function formatDateForDisplay(date: string | Date, format: 'date' | 'datetime' | 'time' = 'date'): string {
  try {
    const dateObj = date instanceof Date ? date : new Date(date);
    
    if (format === 'date') {
      // Format as DD/MM/YYYY
      const day = String(dateObj.getDate()).padStart(2, '0');
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const year = dateObj.getFullYear();
      return `${day}/${month}/${year}`;
    } else if (format === 'time') {
      // Format as HH:MM
      const hours = String(dateObj.getHours()).padStart(2, '0');
      const minutes = String(dateObj.getMinutes()).padStart(2, '0');
      return `${hours}:${minutes}`;
    } else {
      // Format as DD/MM/YYYY HH:MM
      const day = String(dateObj.getDate()).padStart(2, '0');
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const year = dateObj.getFullYear();
      const hours = String(dateObj.getHours()).padStart(2, '0');
      const minutes = String(dateObj.getMinutes()).padStart(2, '0');
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    }
  } catch (e) {
    return String(date);
  }
} 