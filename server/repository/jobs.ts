import sqlite3 from 'sqlite3';
import path from 'path';
import { JobInterface, SourceData } from '../sources/SourceBase';
import { VERBOSE } from '../constants/config';

type JobRow = {
  id: number;
} & JobInterface;

export class JobsRepository {
  readonly dbPath = path.join(__dirname, '../jobs.db');

  private getDB() {
    return new (sqlite3.verbose()).Database(this.dbPath, (err) => {
      if (err) {
        console.error('Error opening database:', err.message);
        return;
      }
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

  async getJobs(limit: number, offset: number) {
    const query = `SELECT * FROM jobs LIMIT ? OFFSET ?`;
    const countQuery = `SELECT COUNT(*) as count FROM jobs`;

    return new Promise((resolve, reject) => {
      const db = this.getDB();
      db.get(countQuery, [], (err, countResult) => {
        if (err) {
          return reject(err);
        }
    
        db.all(query, [limit, offset], (err, rows) => {
          if (err) {
            return reject(err);
          }

          const count = (countResult as any)['count'] || 0;

          return resolve({ rows, count })
    
        });
      });
    });
  }

  async insertJob(job: JobInterface, siteSource: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const db = this.getDB();
  
      const insertStmt = db.prepare('INSERT OR IGNORE INTO jobs (link, datePosted, title, description, company, siteSource) VALUES (?, ?, ?, ?, ?, ?)');

      insertStmt.run(job.link, job.datePosted || new Date().toDateString(), job.title, job.description, job.company, siteSource, (err: unknown) => {
        if (err) {
          reject(err);
        } else {
          // console.log('inserted', job);
          resolve();
        }
      });
    })
  }

  async getLatestJobDate(source: string): Promise<Date> {
    return new Promise((resolve, reject) => {
      const db = this.getDB();
      const query = `
        SELECT datePosted
        FROM jobs
        WHERE siteSource = ?
        ORDER BY datePosted DESC
        LIMIT 1;
      `;

      db.all(query, [source], (err, row) => {
        db.close();

        if (err) {
          return reject(err);
        } else {
          if (row[0]) {
            const latestDate = (row[0] as JobRow).datePosted;

            return resolve(new Date(latestDate));
          } else {
            return resolve(new Date());
          }
        }
      });

  
    })

  }
}

// (new Jobs()).getLatestJobs((new Date()).toDateString())
// (new Jobs()).getLatestJobs('2024-08-01T16:37:46.922Z')
// (new Jobs()).getLatestJobDate('LinkedInJavaScript').then((a) => console.log(a))

