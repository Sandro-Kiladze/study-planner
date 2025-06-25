import { v4 as uuidv4 } from 'uuid';


export const generateId = (): string => uuidv4();


export const getCurrentTimestamp = (): Date => new Date();


export const isValidId = (id: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};


export const findById = <T extends { id: string }>(items: T[], id: string): T | undefined => {
  return items.find(item => item.id === id);
};


export const findIndexById = <T extends { id: string }>(items: T[], id: string): number => {
  return items.findIndex(item => item.id === id);
};


export const updateItemInArray = <T extends { id: string }>(
  items: T[], 
  id: string, 
  updates: Partial<T>
): T[] => {
  const index = findIndexById(items, id);
  if (index === -1) {
    throw new Error(`Item with id ${id} not found`);
  }
  
  const updatedItem = {
    ...items[index],
    ...updates,
    updatedAt: getCurrentTimestamp()
  };
  
  return [
    ...items.slice(0, index),
    updatedItem,
    ...items.slice(index + 1)
  ];
};


export const removeItemFromArray = <T extends { id: string }>(
  items: T[], 
  id: string
): T[] => {
  return items.filter(item => item.id !== id);
};


export const addItemToArray = <T extends { id: string; createdAt: Date; updatedAt: Date }>(
  items: T[], 
  newItem: Omit<T, 'id' | 'createdAt' | 'updatedAt'>
): T[] => {
  const now = getCurrentTimestamp();
  const itemWithMeta = {
    ...newItem,
    id: generateId(),
    createdAt: now,
    updatedAt: now
  } as T;
  
  return [...items, itemWithMeta];
};

/**
 * Pagination helper
 */
export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const paginateArray = <T>(
  items: T[], 
  options: PaginationOptions
): PaginatedResult<T> => {
  const { page, limit } = options;
  const total = items.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  return {
    data: items.slice(startIndex, endIndex),
    pagination: {
      page,
      limit,
      total,
      totalPages
    }
  };
};