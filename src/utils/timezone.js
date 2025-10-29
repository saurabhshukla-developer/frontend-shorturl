/**
 * IST (Indian Standard Time) Timezone Utilities
 * IST is UTC+5:30
 */

// IST timezone constant
export const IST_TIMEZONE = 'Asia/Kolkata';
export const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000; // 5 hours 30 minutes in milliseconds

/**
 * Convert a date to IST and format as YYYY-MM-DD HH:MM
 * @param {Date|string} date - Date object or ISO string
 * @returns {string} Formatted date string in YYYY-MM-DD HH:MM format in IST
 */
export const formatDateToIST = (date) => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Format date in IST timezone
  const formatter = new Intl.DateTimeFormat('en-IN', {
    timeZone: IST_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  
  const parts = formatter.formatToParts(dateObj);
  const year = parts.find(p => p.type === 'year').value;
  const month = parts.find(p => p.type === 'month').value;
  const day = parts.find(p => p.type === 'day').value;
  const hour = parts.find(p => p.type === 'hour').value;
  const minute = parts.find(p => p.type === 'minute').value;
  
  return `${year}-${month}-${day} ${hour}:${minute}`;
};

/**
 * Convert a date to IST and format for datetime-local input (YYYY-MM-DDTHH:MM)
 * @param {Date|string} date - Date object or ISO string
 * @returns {string} Formatted date string for datetime-local input in IST
 */
export const formatDateToISTForInput = (date) => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Format date in IST timezone
  const formatter = new Intl.DateTimeFormat('en-IN', {
    timeZone: IST_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  
  const parts = formatter.formatToParts(dateObj);
  const year = parts.find(p => p.type === 'year').value;
  const month = parts.find(p => p.type === 'month').value;
  const day = parts.find(p => p.type === 'day').value;
  const hour = parts.find(p => p.type === 'hour').value;
  const minute = parts.find(p => p.type === 'minute').value;
  
  return `${year}-${month}-${day}T${hour}:${minute}`;
};

/**
 * Convert a datetime-local input value (in IST) to ISO string for backend
 * Assumes the input value represents IST time
 * @param {string} dateTimeLocal - Date string in format YYYY-MM-DDTHH:MM (assumed to be IST)
 * @returns {string} ISO string representing the UTC equivalent of the IST time
 */
export const convertISTToISO = (dateTimeLocal) => {
  if (!dateTimeLocal) return null;
  
  // Parse the datetime-local value as IST time
  // Format: YYYY-MM-DDTHH:MM
  const [datePart, timePart] = dateTimeLocal.split('T');
  if (!datePart || !timePart) return null;
  
  const [year, month, day] = datePart.split('-').map(Number);
  const [hour, minute] = timePart.split(':').map(Number);
  
  // Create a date assuming IST timezone
  // We create it as a UTC date representing the IST time, then subtract the IST offset
  // IST = UTC + 5:30, so UTC = IST - 5:30
  const istDateUTC = new Date(Date.UTC(year, month - 1, day, hour, minute));
  
  // Convert IST to UTC by subtracting IST offset (5:30 hours)
  const utcDate = new Date(istDateUTC.getTime() - IST_OFFSET_MS);
  
  return utcDate.toISOString();
};

/**
 * Get current date and time in IST formatted for datetime-local input
 * @returns {string} Current date/time in IST for datetime-local input
 */
export const getCurrentISTForInput = () => {
  return formatDateToISTForInput(new Date());
};

