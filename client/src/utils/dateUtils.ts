import { format, isToday, isTomorrow, isYesterday, differenceInDays } from 'date-fns';

export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'MMM dd, yyyy');
};

export const formatDateTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'MMM dd, yyyy HH:mm');
};

export const getRelativeDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isToday(dateObj)) return 'Today';
  if (isTomorrow(dateObj)) return 'Tomorrow';
  if (isYesterday(dateObj)) return 'Yesterday';
  
  const days = differenceInDays(dateObj, new Date());
  if (days > 0) return `In ${days} days`;
  if (days < 0) return `${Math.abs(days)} days ago`;
  
  return formatDate(dateObj);
};

export const isOverdue = (dueDate: Date | string): boolean => {
  const dateObj = typeof dueDate === 'string' ? new Date(dueDate) : dueDate;
  return dateObj < new Date() && !isToday(dateObj);
};

export const getDaysUntilDue = (dueDate: Date | string): number => {
  const dateObj = typeof dueDate === 'string' ? new Date(dueDate) : dueDate;
  return differenceInDays(dateObj, new Date());
};