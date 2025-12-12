/**
 * Helper functions for date manipulation and validation
 */

/**
 * Convert date to ISO string format (YYYY-MM-DD)
 */
export const getDateString = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

/**
 * Calculate date one week before the given date
 */
export const getDateOneWeekBefore = (date: Date): Date => {
  return new Date(date.getTime() - 7 * 24 * 60 * 60 * 1000);
};

/**
 * Initialize date range (last 7 days)
 */
export const initializeDateRange = () => {
  const today = new Date();
  const lastWeek = getDateOneWeekBefore(today);

  return {
    fechaInicial: getDateString(lastWeek),
    fechaFinal: getDateString(today),
  };
};

/**
 * Validate date range
 * @returns error message if invalid, empty string if valid
 */
export const validateDateRange = (
  fechaInicial: string,
  fechaFinal: string
): string => {
  if (!fechaInicial || !fechaFinal) {
    return "Ambas fechas son requeridas";
  }

  const startDate = new Date(fechaInicial);
  const endDate = new Date(fechaFinal);

  if (startDate > endDate) {
    return "La fecha inicial debe ser anterior a la fecha final";
  }

  return "";
};

/**
 * Calculate new date range for loading previous week
 */
export const getPreviousWeekDateRange = (
  currentStartDate: string
): { newStart: string; oldStart: string } => {
  const currentStart = new Date(currentStartDate);
  const newStart = getDateOneWeekBefore(currentStart);

  return {
    newStart: getDateString(newStart),
    oldStart: currentStartDate,
  };
};
