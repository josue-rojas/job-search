import { Jobs } from "./repository/jobs";
import { SourceFactory, SourceType } from "./sources/SourceFactory";

const jobRepo = new Jobs();

async function main() {
  const currentTime = new Date().toISOString();
  console.log('current time', currentTime)
  const type = SourceType.LinkedIn;
  const source = SourceFactory.createSource(type);

  const fetchData = await source.fetch();
  const mappedData = source.mapData(fetchData);

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
  console.log(newData.map((n) => [n.title, n.company, n.link] ));


  return newData

}


main()
