/**
 * Utility functions for date formatting
 */

/**
 * Format a date string for display
 * @param dateString ISO date string to format
 * @param format The format to use
 * @returns Formatted date string
 */
export function formatDateForDisplay(
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