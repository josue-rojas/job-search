import { useEffect, useState, useCallback } from "react";
import { JobInterface, jobService } from "../../service/jobService";
import { JobBox } from "../../components/jobBox";
import { NavBar } from "../../components/NavBar";
import styles from './styles.module.css';

export function HomeView() {
  const [jobListings, setJobListings] = useState<JobInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState<{ siteSources: string[] }>({ siteSources: [] });
  const [selectedSourceType, setSelectedSourceType] = useState<string[]>([]);

  // Load jobs with filters
  const loadJobs = useCallback(async (page: number, filters: { siteSources: string[] }) => {
    setLoading(true);

    try {
      const data = await jobService.getJobs(page, 20, selectedSourceType);
      const { data: { rows } } = data;

      setJobListings((prevListings) => {
        const combinedListings = [...prevListings, ...rows];
        const uniqueListings = Array.from(new Set(combinedListings.map(job => job.id)))
          .map(id => combinedListings.find(job => job.id === id) as JobInterface);

        return uniqueListings;
      });

      setHasMore(rows.length > 0);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [selectedSourceType]);

  useEffect(() => {
    loadJobs(page, filters);
  }, [page, filters, loadJobs]);

  useEffect(() => {
    const loadFilters = async () => {
      try {
        const filterData = await jobService.getFilters();
        setFilters(filterData.data);
      } catch (e) {
        console.error('Error loading filters:', e);
      }
    };
    loadFilters();
  }, []);

  const handleSourceTypeChange = (sourceType: string) => {
    setSelectedSourceType((prev) =>
      prev.includes(sourceType) ? prev.filter((type) => type !== sourceType) : [...prev, sourceType]
    );
    setPage(1);
    setJobListings([]);
  };

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
    <div className={styles.homeView}>
      <NavBar 
        filters={filters} 
        selectedSourceType={selectedSourceType} 
        onFilterChange={handleSourceTypeChange} 
      />

      <div className={styles.home}>
        {jobListings.map((job) => (
          <JobBox
            key={job.id}
            jobId={job.id}
            siteSource={job.siteSource}
            datePosted={job.datePosted}
            company={job.company}
            title={job.title}
            link={job.link}
            onRemove={jobService.toggleHide}
            onRemoveSuccess={() => {
              setJobListings(jobListings.filter((j) => j.id !== job.id));
            }}
          />
        ))}

        {loading && <div>Loading...</div>}
      </div>
    </div>
  );
}
