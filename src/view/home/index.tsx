import { useEffect, useState, useCallback, useMemo } from "react";
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

      setJobListings(prevListings => {
        const combinedListings = [...prevListings, ...rows];

        // remove dupes if fetch is done at twice. this is done in dev https://stackoverflow.com/questions/72406486/react-fetch-api-being-called-2-times-on-page-load
        // maybe this code should run if running in dev only. 
        // TODO: maybe we can also just get rid of this piece of code since dupes are only in dev
        const uniqueListings = Array.from(new Set(combinedListings.map(job => job.id)))
          .map(id => combinedListings.find(job => job.id === id) as JobInterface);

        return uniqueListings;
      });
      
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
          key={job.id}
          siteSource={job.siteSource}
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
