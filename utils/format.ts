import { format, parseISO, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval } from 'date-fns';
import { zhCN } from 'date-fns/locale';

// Format currency (Chinese Yuan)
export function formatCurrency(amount: number): string {
  return `¥${amount.toFixed(2)}`;
}

// Format date for display
export function formatDate(dateString: string): string {
  const date = parseISO(dateString);
  return format(date, 'M月d日', { locale: zhCN });
}

// Format date with year
export function formatDateFull(dateString: string): string {
  const date = parseISO(dateString);
  return format(date, 'yyyy年M月d日', { locale: zhCN });
}

// Format datetime
export function formatDateTime(dateString: string): string {
  const date = parseISO(dateString);
  return format(date, 'M月d日 HH:mm', { locale: zhCN });
}

// Get today's date string
export function getTodayString(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

// Get current month range
export function getCurrentMonthRange(): { start: Date; end: Date } {
  const now = new Date();
  return {
    start: startOfMonth(now),
    end: endOfMonth(now),
  };
}

// Get week range
export function getWeekRange(date: Date): { start: Date; end: Date } {
  return {
    start: startOfWeek(date, { weekStartsOn: 1 }),
    end: endOfWeek(date, { weekStartsOn: 1 }),
  };
}

// Get year range
export function getYearRange(date: Date): { start: Date; end: Date } {
  return {
    start: startOfYear(date),
    end: endOfYear(date),
  };
}

// Get days in range
export function getDaysInRange(start: Date, end: Date): Date[] {
  return eachDayOfInterval({ start, end });
}

// Get weeks in range
export function getWeeksInRange(start: Date, end: Date): Date[] {
  return eachWeekOfInterval({ start, end }, { weekStartsOn: 1 });
}

// Get months in range
export function getMonthsInRange(start: Date, end: Date): Date[] {
  return eachMonthOfInterval({ start, end });
}

// Format date for grouping
export function formatDateGroup(dateString: string): string {
  const date = parseISO(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (format(date, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')) {
    return '今天';
  }
  if (format(date, 'yyyy-MM-dd') === format(yesterday, 'yyyy-MM-dd')) {
    return '昨天';
  }
  return format(date, 'M月d日 EEEE', { locale: zhCN });
}

// Generate date string for storage
export function toDateString(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}