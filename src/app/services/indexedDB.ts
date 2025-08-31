// IndexedDB service for caching dropdown options
const DB_NAME = 'FedAppDB';
const DB_VERSION = 1;
const DROPDOWN_STORE = 'dropdownOptions';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

interface CachedDropdownData {
  type: string;
  data: { id: string; name: string }[];
  timestamp: number;
}

class IndexedDBService {
  private db: IDBDatabase | null = null;

  async initDB(): Promise<IDBDatabase> {
    if (this.db) {
      return this.db;
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        reject(new Error('Failed to open IndexedDB'));
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create object store for dropdown options
        if (!db.objectStoreNames.contains(DROPDOWN_STORE)) {
          const store = db.createObjectStore(DROPDOWN_STORE, { keyPath: 'type' });
          store.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });
  }

  async getDropdownOptions(type: string): Promise<{ id: string; name: string }[] | null> {
    try {
      const db = await this.initDB();
      const transaction = db.transaction([DROPDOWN_STORE], 'readonly');
      const store = transaction.objectStore(DROPDOWN_STORE);
      const request = store.get(type);

      return new Promise((resolve, reject) => {
        request.onerror = () => {
          reject(new Error('Failed to get dropdown options from IndexedDB'));
        };

        request.onsuccess = () => {
          const result = request.result as CachedDropdownData | undefined;

          if (!result) {
            resolve(null);
            return;
          }

          const now = Date.now();
          const isExpired = (now - result.timestamp) > CACHE_DURATION;

          if (isExpired) {
            // Delete expired data
            this.deleteDropdownOptions(type);
            resolve(null);
          } else {
            resolve(result.data);
          }
        };
      });
    } catch (error) {
      console.error('Error getting dropdown options from IndexedDB:', error);
      return null;
    }
  }

  async setDropdownOptions(type: string, data: { id: string; name: string }[]): Promise<void> {
    try {
      const db = await this.initDB();
      const transaction = db.transaction([DROPDOWN_STORE], 'readwrite');
      const store = transaction.objectStore(DROPDOWN_STORE);

      const cachedData: CachedDropdownData = {
        type,
        data,
        timestamp: Date.now()
      };

      const request = store.put(cachedData);

      return new Promise((resolve, reject) => {
        request.onerror = () => {
          reject(new Error('Failed to store dropdown options in IndexedDB'));
        };

        request.onsuccess = () => {
          resolve();
        };
      });
    } catch (error) {
      console.error('Error storing dropdown options in IndexedDB:', error);
      throw error;
    }
  }

  async deleteDropdownOptions(type: string): Promise<void> {
    try {
      const db = await this.initDB();
      const transaction = db.transaction([DROPDOWN_STORE], 'readwrite');
      const store = transaction.objectStore(DROPDOWN_STORE);
      const request = store.delete(type);

      return new Promise((resolve, reject) => {
        request.onerror = () => {
          reject(new Error('Failed to delete dropdown options from IndexedDB'));
        };

        request.onsuccess = () => {
          resolve();
        };
      });
    } catch (error) {
      console.error('Error deleting dropdown options from IndexedDB:', error);
      throw error;
    }
  }

  async clearExpiredData(): Promise<void> {
    try {
      const db = await this.initDB();
      const transaction = db.transaction([DROPDOWN_STORE], 'readwrite');
      const store = transaction.objectStore(DROPDOWN_STORE);
      const index = store.index('timestamp');
      const now = Date.now();
      const cutoffTime = now - CACHE_DURATION;

      const request = index.openCursor(IDBKeyRange.upperBound(cutoffTime));

      return new Promise((resolve, reject) => {
        request.onerror = () => {
          reject(new Error('Failed to clear expired data from IndexedDB'));
        };

        request.onsuccess = () => {
          const cursor = request.result;
          if (cursor) {
            cursor.delete();
            cursor.continue();
          } else {
            resolve();
          }
        };
      });
    } catch (error) {
      console.error('Error clearing expired data from IndexedDB:', error);
      throw error;
    }
  }

  async clearAllData(): Promise<void> {
    try {
      const db = await this.initDB();
      const transaction = db.transaction([DROPDOWN_STORE], 'readwrite');
      const store = transaction.objectStore(DROPDOWN_STORE);
      const request = store.clear();

      return new Promise((resolve, reject) => {
        request.onerror = () => {
          reject(new Error('Failed to clear all data from IndexedDB'));
        };

        request.onsuccess = () => {
          resolve();
        };
      });
    } catch (error) {
      console.error('Error clearing all data from IndexedDB:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const indexedDBService = new IndexedDBService();

// Initialize IndexedDB when the module is loaded
if (typeof window !== 'undefined') {
  // Clear expired data on app startup
  indexedDBService.clearExpiredData().catch(console.error);
}