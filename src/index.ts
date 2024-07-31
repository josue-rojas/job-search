import { SourceFactory, SourceType } from "./sources/SourceFactory";
// import { SourceData } from './sources/SourceBase';
import { seen } from "./seen";

const jobsSeen = new Set<string>(seen);

async function main() {
  const type = SourceType.LinkedIn;
  const source = SourceFactory.createSource(type);

  const fetchData = await source.fetch();
  // console.log('---',fetchData)
  const mappedData = source.mapData(fetchData);

  // check if job has already been seen
  // TODO: this should be checked on a db
  const newData = mappedData.data.filter((job) => {
    const isNewJob = !jobsSeen.has(job.link);
    if (isNewJob) {
      jobsSeen.add(job.link);
    }

    return isNewJob;
  });

  // console.log(newData);
  console.log(JSON.stringify(jobsSeen));


  return newData

}


main()
