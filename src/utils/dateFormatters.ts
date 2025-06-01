/**
 * Utility functions for consistent date formatting in the application
 * to prevent hydration errors related to date localization
 */

/**
 * Format a date string using a consistent locale format (British English)
 * @param dateString The date string to format
 * @returns Formatted date string (DD/MM/YYYY)
 */
export const formatDate = (dateString: string): string => {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(new Date(dateString));
};

/**
 * Format a date with time using a consistent locale format
 * @param dateString The date string to format
 * @returns Formatted date and time string (DD/MM/YYYY, HH:MM)
 */
export const formatDateTime = (dateString: string): string => {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(new Date(dateString));
};

/**
 * Format a date for use in form inputs (YYYY-MM-DD)
 * @param dateString The date string to format
 * @returns Formatted date string in YYYY-MM-DD format
 */
export const formatDateForInput = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Client-side only wrapper for date formatting
 * This function should be used inside useEffect or event handlers
 * to prevent hydration errors
 * @param dateString The date string to format
 * @param formatter The formatter function to use
 * @returns Formatted date string
 */
export const clientSideFormat = (
  dateString: string, 
  formatter: (date: string) => string = formatDate
): string => {
  // This is safe to use client-side only
  return formatter(dateString);
};

/**
 * Function to create date formatter with a specific locale
 * @param locale Locale string (e.g. 'en-US', 'en-GB')
 * @returns A date formatter function
 */
export const createDateFormatter = (locale: string) => {
  return (dateString: string): string => {
    return new Intl.DateTimeFormat(locale, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(new Date(dateString));
  };
}; 