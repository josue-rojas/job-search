import { useEffect, useState, useCallback } from "react";
import { JobInterface, jobService } from "../../service/jobService";
import { JobBox } from "../../components/jobBox";
import styles from './styles.module.css';

export function HomeView() {
  const [jobListings, setJobListings] = useState<JobInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadJobs = useCallback(async (page: number) => {
    setLoading(true);

    try {
      const data = await jobService.getJobs(page);
      console.log('Successfully fetched data', { page });
      const { data: { rows } } = data;

      setJobListings(prevListings => [...prevListings, ...rows]);
      setHasMore(rows.length > 0); // Update hasMore based on the fetched data
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadJobs(page);
  }, [page, loadJobs]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 && !loading && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore]);

  return (
    <div className={styles.home}>
      {jobListings.map((job) => (
        <JobBox
          key={job.link}
          datePosted={job.datePosted}
          company={job.company}
          title={job.title}
          link={job.link}
        />
      ))}
      {loading && <div>Loading...</div>}
    </div>
  );
}
