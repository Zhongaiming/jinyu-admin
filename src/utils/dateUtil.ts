import { format, parseISO } from 'date-fns';

const DATE_TIME_FORMAT = 'yyyy-MM-dd HH:mm';
const DATE_FORMAT = 'yyyy-MM-dd';

export function formatToDateTime(
  date: Date | number | string,
  formatStr = DATE_TIME_FORMAT
): string {
  if (typeof date === 'string') {
    return format(parseISO(date), formatStr);
  }
  return format(date, formatStr);
}

/**
 *根据提供的格式字符串或默认格式将给定日期值格式化为字符串。
 *
 *@param {date|number | string} date -要格式化的日期值。
 *@param {string} [formatStr=DATE_FORMAT] -用于格式化日期的格式字符串。
 *@return {string} 格式化的日期字符串。
 *
 */
export function formatToDate(date: Date | number | string, formatStr = DATE_FORMAT): string {
  if (typeof date === 'string') {
    return format(parseISO(date), formatStr);
  }
  return format(date, formatStr);
}
