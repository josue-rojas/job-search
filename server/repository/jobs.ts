import sqlite3 from 'sqlite3';
import path from 'path';
import { JobInterface, SourceData } from '../sources/SourceBase';
import { VERBOSE } from '../constants/config';

type JobRow = {
  id: number;
} & JobInterface;

export class JobsRepository {
  readonly dbPath = path.join(__dirname, '../db/jobs.db');

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

  async getJobs(limit: number, offset: number, hideFilter: boolean | null, sourceTypes: string[] | null) {
    const sourceTypeFilter = sourceTypes && sourceTypes.length > 0 ? sourceTypes : null;
  
    const query = `
      SELECT * 
      FROM jobs
      WHERE (
        CASE
          WHEN ? = true THEN hide = 1
          ELSE (hide IS NULL OR hide = 0)
        END
      )
      AND (${sourceTypeFilter ? `sourceType IN (${sourceTypeFilter.map(() => '?').join(',')})` : '1=1'})
      ORDER BY datePosted DESC
      LIMIT ? OFFSET ?;
    `;
    const params = [hideFilter, ...(sourceTypeFilter || []), limit, offset];
    const countQuery = `
      SELECT COUNT(*) as count 
      FROM jobs
      WHERE (
        CASE
          WHEN ? = true THEN hide = 1
          ELSE (hide IS NULL OR hide = 0)
        END
      )
      AND (${sourceTypeFilter ? `sourceType IN (${sourceTypeFilter.map(() => '?').join(',')})` : '1=1'});
    `;
  
    return new Promise((resolve, reject) => {
      const db = this.getDB();
      db.get(countQuery, [hideFilter, ...(sourceTypeFilter || [])], (err, countResult) => {
        if (err) {
          return reject(err);
        }

        db.all(query, params, (err, rows) => {
          db.close();

          if (err) {
            return reject(err);
          }

          const count = (countResult as any)['count'] || 0;
          return resolve({ rows, count });
        });
      });
    });
  }

  async insertJob(job: JobInterface, siteSource: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const db = this.getDB();
  
      const insertStmt = db.prepare('INSERT OR IGNORE INTO jobs (link, datePosted, title, description, company, siteSource, hide) VALUES (?, ?, ?, ?, ?, ?, False)');

      insertStmt.run(job.link, job.datePosted || new Date().toDateString(), job.title, job.description, job.company, siteSource, false, (err: unknown) => {
        if (err) {
          reject(err);
        } else {
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

  async getUniqueSiteSources(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      const db = this.getDB();
      const query = `
        SELECT DISTINCT siteSource
        FROM jobs;
      `;

      db.all(query, [], (err, rows) => {
        db.close();

        if (err) {
          return reject(err);
        } else {
          const siteSources = (rows as {siteSource: string}[]).map(row => row.siteSource as string);

          return resolve(siteSources);
        }
      });
    });
  }

  async toggleHide(jobId: number, hideValue: boolean | null = null): Promise<void> {
    return new Promise((resolve, reject) => {
      const db = this.getDB();

      // If a value is passed in, use it; otherwise, toggle the existing value
      const query = `
        UPDATE jobs
        SET hide = CASE
          WHEN ? IS NULL THEN TRUE
          ELSE ?
        END
        WHERE id = ?;
      `;
      
      db.run(query, [hideValue, hideValue, jobId], function (err) {
        db.close();
        
        if (err) {
          return reject(err);
        } else {
          return resolve();
        }
      });
    });
  }
}

// (new Jobs()).getLatestJobs((new Date()).toDateString())
// (new Jobs()).getLatestJobs('2024-08-01T16:37:46.922Z')
// (new Jobs()).getLatestJobDate('LinkedInJavaScript').then((a) => console.log(a))

