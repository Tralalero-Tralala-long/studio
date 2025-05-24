import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { parse, parseISO, isBefore, startOfDay } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isCodeExpired(expiryDateString: string): boolean {
  if (!expiryDateString || expiryDateString.toLowerCase() === "n/a" || expiryDateString.toLowerCase() === "not specified") {
    return false; // Treat as non-expiring
  }

  let expiryDate: Date;

  // Try parsing "yyyy-MM-dd" (used by AddCodeForm)
  if (/^\d{4}-\d{2}-\d{2}$/.test(expiryDateString)) {
    expiryDate = parseISO(expiryDateString);
  } else {
    // Try parsing "Month Day, Year" (used in some initial data)
    // For `parse` to correctly interpret "Month Day, Year", it's good practice to provide a reference date.
    const parsedFromMonthDayYear = parse(expiryDateString, 'MMMM d, yyyy', new Date());
    if (!isNaN(parsedFromMonthDayYear.getTime())) {
      expiryDate = parsedFromMonthDayYear;
    } else {
      // Fallback for other potential date string formats that Date constructor might handle
      const parsedFromNewDate = new Date(expiryDateString);
      if (!isNaN(parsedFromNewDate.getTime())) {
        expiryDate = parsedFromNewDate;
      } else {
        console.warn(`Could not parse expiry date: ${expiryDateString}. Treating as non-expiring.`);
        return false; // Treat unparseable dates as non-expiring to be safe
      }
    }
  }
  
  if (isNaN(expiryDate.getTime())) {
    // This case should ideally be caught by the checks above, but as a final safety net:
    console.warn(`Could not parse expiry date after attempts: ${expiryDateString}. Treating as non-expiring.`);
    return false;
  }

  // Compare the expiry date with the start of today.
  // If the expiry date is before the start of today, it's considered expired.
  return isBefore(expiryDate, startOfDay(new Date()));
}
