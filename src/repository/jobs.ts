import sqlite3 from 'sqlite3';
import path from 'path';
import { JobInterface, SourceData } from '../sources/SourceBase';
import { VERBOSE } from '../constants/config';

type JobRow = {
  id: number;
} & JobInterface;

export class Jobs {
  readonly dbPath = path.join(__dirname, '../jobs.db');

  private getDB() {
    return new (sqlite3.verbose()).Database(this.dbPath, (err) => {
      if (err) {
        console.error('Error opening database:', err.message);
        return;
      }

      // if (VERBOSE) {
      //   console.log('Connected to the SQLite database.');
      // }
    });
  }

  async getLatestJobs(date: string): Promise<JobRow[]> {
    return new Promise((resolve, reject) => {
      const db = this.getDB();
      const query = `
        SELECT * FROM jobs
        WHERE datePosted > ?
        ORDER BY datePosted DESC
      `;
  
      db.all(query, [date], (err, row) => {
        db.close();

        if (err) {
          return reject(err);
        } else {
          return resolve(row as JobRow[])
        }
      });
  
    })
  }

  async insertJob(job: JobInterface): Promise<void> {
    return new Promise((resolve, reject) => {
      const db = this.getDB();
  
      const insertStmt = db.prepare('INSERT OR IGNORE INTO jobs (link, datePosted, title, description, company) VALUES (?, ?, ?, ?, ?)');

      insertStmt.run(job.link, job.datePosted || new Date().toDateString(), job.title, job.description, job.company, (err: unknown) => {
        if (err) {
          reject(err);
        } else {
          // console.log('inserted', job);
          resolve();
        }
      });
    })
  }

  async getLatestJobDate(): Promise<Date> {
    return new Promise((resolve, reject) => {
      const db = this.getDB();
      const query = `
        SELECT datePosted
        FROM jobs
        ORDER BY datePosted DESC
        LIMIT 1;
      `;
  
      db.all(query, (err, row) => {
        db.close();

        if (err) {
          return reject(err);
        } else {
          const latestDate = (row[0] as JobRow).datePosted
          return resolve(new Date(latestDate))
        }
      });
  
    })

  }
}

// (new Jobs()).getLatestJobs((new Date()).toDateString())
// (new Jobs()).getLatestJobs('2024-08-01T16:37:46.922Z')
(new Jobs()).getLatestJobDate()

