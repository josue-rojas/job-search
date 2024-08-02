import { Jobs } from "./repository/jobs";
import { SourceFactory, SourceType } from "./sources/SourceFactory";

const jobRepo = new Jobs();

const SOURCE_TYPE = SourceType.LinkedIn;
const DEFAULT_DATE_SEARCH = '';

async function main() {
  const type = SOURCE_TYPE;
  const source = SourceFactory.createSource(type);

  const fetchData = await source.fetch();
  const mappedData = source.mapData(fetchData);

  const latestDateJobFound = (await jobRepo.getLatestJobDate(mappedData.siteSource)).toISOString();

  for await (let newJob of mappedData.data) {
    try {
      await jobRepo.insertJob(newJob, mappedData.siteSource);
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


main()
