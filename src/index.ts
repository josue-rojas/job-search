import { Jobs } from "./repository/jobs";
import { SourceFactory, SourceType } from "./sources/SourceFactory";
// import { SourceData } from './sources/SourceBase';
// import { seen } from "./seen";

// const jobsSeen = new Set<string>(seen);

const jobRepo = new Jobs();

async function main() {
  const currentTime = new Date().toISOString();
  console.log('current time', currentTime)
  const type = SourceType.LinkedIn;
  const source = SourceFactory.createSource(type);

  const fetchData = await source.fetch();
  const mappedData = source.mapData(fetchData);

  // check if job has already been seen
  // TODO: this should be checked on a db
  // const newData = mappedData.data.filter((job) => {
  //   const isNewJob = !jobsSeen.has(job.link);
  //   if (isNewJob) {
  //     console.log('adding---', job.link)
  //     jobsSeen.add(job.link);
  //   }

  //   return isNewJob;
  // });

  for await (let newJob of mappedData.data) {
    try {
      await jobRepo.insertJob(newJob);
    } catch (err) {
      console.error('erorr with', newJob.link);
      console.error(err);
    }
  }

  const newData = await jobRepo.getLatestJobs(currentTime);

  console.log(currentTime);
  console.log('newLinkl--', newData.map((n) => n.link ));


  return newData

}


main()
