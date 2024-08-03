import { JobsRepository } from "./repository/jobs";
import { SourceFactory, SourceType, SourceFactoryOptions } from "./sources/SourceFactory";

const jobRepo = new JobsRepository();

async function main(sourceType: SourceType, sourceOptions: SourceFactoryOptions) {
  const source = SourceFactory.createSource(sourceType, sourceOptions);
  const sourceName = source.getSourceName();

  console.log(new Date().toLocaleDateString(), `Source: ${sourceName}`);

  const fetchData = await source.fetch();
  const mappedData = source.mapData(fetchData);

  const latestDateJobFound = (await jobRepo.getLatestJobDate(sourceName)).toISOString();

  // insert all jobs found
  for await (let newJob of mappedData.data) {
    try {
      await jobRepo.insertJob(newJob, sourceName);
    } catch (err) {
      console.error('erorr with', newJob.link);
      console.error(err);
    }
  }

  const newData = await jobRepo.getLatestJobs(latestDateJobFound);

  console.log('Last Job Time:', latestDateJobFound);
  console.log(newData.map((n) => [n.title, n.company, n.link, n.datePosted] ));


  return newData

}

(async () => {
  await main(SourceType.LinkedIn, { keyword: 'TypeScript', location: 'New York' });
  await main(SourceType.LinkedIn, { keyword: 'JavaScript', location: 'New York' });
  await main(SourceType.LinkedIn, { keyword: 'software engineer', location: 'New York' });
})();