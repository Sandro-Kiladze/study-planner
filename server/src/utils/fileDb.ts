import fs from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

/**
 * File-based database utility class
 */
export class FileDatabase {
  private static readonly DATA_DIR = path.join(__dirname, '../data');
  private static readonly BACKUP_DIR = path.join(FileDatabase.DATA_DIR, 'backups');

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
   * @param filename - Name of the JSON file (without extension)
   * @returns Promise<T[]> - Array of parsed objects
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
        throw new Error(`Invalid JSON in file ${filename}`);
      }
      console.error(`Error reading file ${filename}:`, error);
      throw new Error(`Failed to read file ${filename}`);
    }
  }

  /**
   * Write data to JSON file with backup
   * @param filename - Name of the JSON file (without extension)
   * @param data - Array of data to write
   */
  static async writeJsonFile<T>(filename: string, data: T[]): Promise<void> {
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
   * @param filename - Name of the file to backup
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
    }
  }

  /**
   * Check if a file exists
   * @param filename - Name of the file to check
   */
  static fileExists(filename: string): boolean {
    return existsSync(FileDatabase.getFilePath(filename));
  }

  /**
   * Delete a file
   * @param filename - Name of the file to delete
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
   * @param filename 
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

export const readJsonFile = <T>(filename: string): Promise<T[]> => 
  FileDatabase.readJsonFile<T>(filename);

export const writeJsonFile = <T>(filename: string, data: T[]): Promise<void> => 
  FileDatabase.writeJsonFile<T>(filename, data);