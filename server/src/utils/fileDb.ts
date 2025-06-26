import fs from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';
import { v4 as uuidv4 } from 'uuid';

/**
 * Generate a unique ID for database records
 */
export function generateId(): string {
    return uuidv4();
}

/**
 * File-based database utility class with file locking
 */
export class FileDatabase {
  private static readonly DATA_DIR = path.join(__dirname, '../data');
  private static readonly BACKUP_DIR = path.join(FileDatabase.DATA_DIR, 'backups');
  
  // Lock mechanism to prevent concurrent writes
  private static fileLocks = new Map<string, Promise<void>>();

  static async initializeDirectories(): Promise<void> {
    try {
      if (!existsSync(FileDatabase.DATA_DIR)) {
        await fs.mkdir(FileDatabase.DATA_DIR, { recursive: true });
      }
      if (!existsSync(FileDatabase.BACKUP_DIR)) {
        await fs.mkdir(FileDatabase.BACKUP_DIR, { recursive: true });
      }
    } catch (error) {
      console.error('Failed to initialize directories:', error);
      throw new Error('Database initialization failed');
    }
  }

  /**
   * Get the full path for a data file
   */
  private static getFilePath(filename: string): string {
    if (!filename.endsWith('.json')) {
      filename += '.json';
    }
    return path.join(FileDatabase.DATA_DIR, filename);
  }

  /**
   * Get the backup file path
   */
  private static getBackupPath(filename: string): string {
    if (!filename.endsWith('.json')) {
      filename += '.json';
    }
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupName = `${filename.replace('.json', '')}-${timestamp}.json`;
    return path.join(FileDatabase.BACKUP_DIR, backupName);
  }

  /**
   * Read JSON file and return parsed data
   */
  static async readJsonFile<T>(filename: string): Promise<T[]> {
    const filePath = FileDatabase.getFilePath(filename);
    
    try {
      if (!existsSync(filePath)) {
        await FileDatabase.writeJsonFile(filename, []);
        return [];
      }

      const data = await fs.readFile(filePath, 'utf-8');
      
      if (!data.trim()) {
        return [];
      }

      const parsed = JSON.parse(data);
      
      if (!Array.isArray(parsed)) {
        throw new Error(`File ${filename} does not contain a valid array`);
      }

      return parsed as T[];
    } catch (error) {
      if (error instanceof SyntaxError) {
        console.error(`JSON parse error in ${filename}:`, error.message);
        // Create backup of corrupted file
        await FileDatabase.createBackup(filename);
        throw new Error(`Invalid JSON in file ${filename}`);
      }
      console.error(`Error reading file ${filename}:`, error);
      throw new Error(`Failed to read file ${filename}`);
    }
  }

  /**
   * Write data to JSON file with file locking and backup
   */
  static async writeJsonFile<T>(filename: string, data: T[]): Promise<void> {
    const filePath = FileDatabase.getFilePath(filename);
    const lockKey = filePath;
    
    // Wait for any existing lock to be released
    if (FileDatabase.fileLocks.has(lockKey)) {
      await FileDatabase.fileLocks.get(lockKey);
    }
    
    // Create new lock
    const lockPromise = FileDatabase.performWrite(filename, data);
    FileDatabase.fileLocks.set(lockKey, lockPromise);
    
    try {
      await lockPromise;
    } finally {
      // Release lock
      FileDatabase.fileLocks.delete(lockKey);
    }
  }

  /**
   * Perform the actual write operation with backup
   */
  private static async performWrite<T>(filename: string, data: T[]): Promise<void> {
    const filePath = FileDatabase.getFilePath(filename);
    
    try {
      await FileDatabase.initializeDirectories();
      
      if (existsSync(filePath)) {
        await FileDatabase.createBackup(filename);
      }

      const jsonData = JSON.stringify(data, null, 2);
      await fs.writeFile(filePath, jsonData, 'utf-8');
    } catch (error) {
      console.error(`Error writing file ${filename}:`, error);
      throw new Error(`Failed to write file ${filename}`);
    }
  }

  /**
   * Create a backup of the current file
   */
  static async createBackup(filename: string): Promise<void> {
    const filePath = FileDatabase.getFilePath(filename);
    const backupPath = FileDatabase.getBackupPath(filename);

    try {
      if (existsSync(filePath)) {
        await fs.copyFile(filePath, backupPath);
      }
    } catch (error) {
      console.error(`Failed to create backup for ${filename}:`, error);
      // Don't throw error for backup failure - it shouldn't prevent main operation
    }
  }

  /**
   * Check if a file exists
   */
  static fileExists(filename: string): boolean {
    return existsSync(FileDatabase.getFilePath(filename));
  }

  /**
   * Delete a file
   */
  static async deleteFile(filename: string): Promise<void> {
    const filePath = FileDatabase.getFilePath(filename);
    
    try {
      if (existsSync(filePath)) {
        await FileDatabase.createBackup(filename);
        await fs.unlink(filePath);
      }
    } catch (error) {
      console.error(`Error deleting file ${filename}:`, error);
      throw new Error(`Failed to delete file ${filename}`);
    }
  }

  /**
   * Get file statistics
   */
  static async getFileStats(filename: string): Promise<{
    size: number;
    modified: Date;
    created: Date;
  } | null> {
    const filePath = FileDatabase.getFilePath(filename);
    
    try {
      if (!existsSync(filePath)) {
        return null;
      }

      const stats = await fs.stat(filePath);
      return {
        size: stats.size,
        modified: stats.mtime,
        created: stats.birthtime
      };
    } catch (error) {
      console.error(`Error getting stats for ${filename}:`, error);
      return null;
    }
  }
}

// Utility exports for simpler usage
export const readJsonFile = <T>(filename: string): Promise<T[]> => 
  FileDatabase.readJsonFile<T>(filename);

export const writeJsonFile = <T>(filename: string, data: T[]): Promise<void> => 
  FileDatabase.writeJsonFile<T>(filename, data);