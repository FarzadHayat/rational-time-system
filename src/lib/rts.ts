export const RTS_MONTHS = [
  "Primus",
  "Secundus",
  "Tertius",
  "Quartus",
  "Quintus",
  "Sextus",
  "Septimus",
  "Octavus",
  "Nonus",
  "Decimus",
  "Undecimus",
  "Duodecimus",
  "Terminus",
];

export interface DecimalTime {
  hours: number;
  minutes: number;
  seconds: number;
}

export interface RTSDate {
  year: number;
  month: number;
  day: number;
  monthName: string;
  isGlobalHoliday: boolean;
  holidayDayIndex?: number; // 1 or 2 (if leap year)
}

/**
 * Converts a standard Date to RTS Decimal Time (based on UTC)
 */
export function getDecimalTime(date: Date): DecimalTime {
  // Get milliseconds since epoch and find remainder for current UTC day
  const msSinceMidnight = date.getTime() % 86400000;
  
  // Calculate total decimal seconds (100,000 per day instead of 86,400)
  const decimalSecondsTotal = (msSinceMidnight / 86400000) * 100000;
  
  const hours = Math.floor(decimalSecondsTotal / 10000);
  const minutes = Math.floor((decimalSecondsTotal % 10000) / 100);
  const seconds = Math.floor(decimalSecondsTotal % 100);
  
  return { hours, minutes, seconds };
}

/**
 * Calculates the day of the year (1-366) based on UTC
 */
function getDayOfYearUTC(date: Date): number {
  const start = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay) + 1;
}

/**
 * Converts a standard Date to the RTS Calendar Date
 */
export function getRTSDate(date: Date): RTSDate {
  const year = date.getUTCFullYear();
  const dayOfYear = getDayOfYearUTC(date);
  
  if (dayOfYear <= 364) {
    const month = Math.floor((dayOfYear - 1) / 28) + 1;
    const day = ((dayOfYear - 1) % 28) + 1;
    
    return {
      year,
      month,
      day,
      monthName: RTS_MONTHS[month - 1],
      isGlobalHoliday: false,
    };
  } else {
    // It's the 365th or 366th day! Global Holiday time.
    const holidayDayIndex = dayOfYear - 364; // 1 or 2
    
    return {
      year,
      month: 13, // Fallback to last month
      day: 28 + holidayDayIndex, // Fallback day, though won't be used in UI grid
      monthName: holidayDayIndex === 1 ? "Year Day" : "Leap Day",
      isGlobalHoliday: true,
      holidayDayIndex,
    };
  }
}

/**
 * Format a number with leading zero (e.g. 5 -> "05")
 */
export function padZero(num: number): string {
  return num.toString().padStart(2, '0');
}

/**
 * Converts an RTS Date (Year, Month, Day) back to a standard Gregorian Date (at UTC midnight)
 */
export function getGregorianDateFromRTS(year: number, month: number, day: number, isGlobalHoliday: boolean, holidayDayIndex: number = 1): Date {
  let dayOfYear = 1;
  if (isGlobalHoliday) {
    dayOfYear = 364 + holidayDayIndex;
  } else {
    dayOfYear = (month - 1) * 28 + day;
  }
  
  // Date.UTC takes month 0-11, so Jan 1 is 0, 1. 
  // We can just use Jan 1st and add the days.
  const date = new Date(Date.UTC(year, 0, 1));
  date.setUTCDate(dayOfYear);
  return date;
}
