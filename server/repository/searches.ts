import sqlite3 from 'sqlite3';
import path from 'path';
// import { JobInterface, SourceData } from '../sources/SourceBase';
import { VERBOSE } from '../constants/config';

interface SearchesInterface {
  id: number;
  sourceType: string;
  sourceOptions: string;
  isDisabled: boolean; // todo: need to make sure this is a boolean in the db
}

export class SearchesRepository {
  readonly dbPath = path.join(__dirname, '../db/searches.db');

  private getDB() {
    return new (sqlite3.verbose()).Database(this.dbPath, (err) => {
      if (err) {
        console.error('Error opening database:', err.message);
        return;
      }
    });
  }

  async getAllSearches(): Promise<SearchesInterface[]> {
    return new Promise((resolve, reject) => {
      const db = this.getDB();
      const query = `
        SELECT * FROM searches;
      `;
  
      db.all(query, (err, row) => {
        db.close();

        if (err) {
          return reject(err);
        } else {
          return resolve(row as SearchesInterface[]);
        }
      });
  
    });
  }

  async getAllActiveSearches(): Promise<SearchesInterface[]> {
    return new Promise((resolve, reject) => {
      const db = this.getDB();
      const query = `
        SELECT * FROM searches WHERE isDisabled IS NOT 1;
      `;
  
      db.all(query, (err, row) => {
        db.close();

        if (err) {
          return reject(err);
        } else {
          return resolve(row as SearchesInterface[]);
        }
      });
  
    });
  }

  async insertSearch(sourceType: string, sourceOptions: string): Promise<number> {
    return new Promise((resolve, reject) => {
      const db = this.getDB();
      const query = `
        INSERT INTO searches (sourceType, sourceOptions)
        VALUES (?, ?);
      `;

      db.run(query, [sourceType, sourceOptions], function (err) {
        db.close();

        if (err) {
          return reject(err);
        } else {
          resolve(this.lastID);
        }
      });
    });
  }

  async deleteSearch(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const db = this.getDB();
      const query = `
        DELETE FROM searches WHERE id = ?;
      `;

      db.run(query, [id], function (err) {
        db.close();

        if (err) {
          return reject(err);
        } else if (this.changes === 0) {
          return reject(new Error(`No search found with id: ${id}`));
        } else {
          resolve();
        }
      });
    });
  }
}

// examples
// (new SearchesRepository()).insertSearch('LinkedIn', 'Search options here').then(() => console.log('Insert successful'));
// (new SearchesRepository()).deleteSearch(1).then(() => console.log('Delete successful')).catch(err => console.error('Delete failed:', err));
// (new SearchesRepository()).getAllSearchs();
