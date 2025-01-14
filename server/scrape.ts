import { JobsRepository } from "./repository/jobs";
import { SearchesRepository } from "./repository/searches";
import { SourceFactory, SourceType, SourceFactoryOptions } from "./sources/SourceFactory";

const jobRepo = new JobsRepository();

async function scrape(sourceType: SourceType, sourceOptions: SourceFactoryOptions) {
  try {
    
    const source = SourceFactory.createSource(sourceType, sourceOptions);
    const sourceName = source.SourceName;
  
    console.log(new Date().toISOString(), `Source: ${sourceName}`);

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

    // console.log('latestDate', mappedData.data)
  
    // const newData = await jobRepo.getLatestJobs(latestDateJobFound);
  
    // console.log('Last Job Time:', latestDateJobFound);
    // console.log(newData.map((n) => [n.title, n.company, n.link, n.datePosted] ));
    console.log('Done Scraping', sourceName, sourceOptions)
  
    return mappedData;
  } catch (e) {
    console.error('ERROR', e, sourceType, sourceOptions);
  }
}

export async function scrapeOrchestrator() {
  // const defaultTypes = {
  //   location: 'New York',
  //   geoId: '102571732',
  //   experienceLevels: ['2', '3', '4'],
  //   datePosted: 86400,
  //   keyword: "TypeScript"
  // }
  // await scrape(SourceType.LinkedIn, { ...defaultTypes, keyword: 'TypeScript' });
  // await scrape(SourceType.LinkedIn, { ...defaultTypes, keyword: 'JavaScript'});
  // await scrape(SourceType.LinkedIn, { ...defaultTypes, keyword: 'software engineer' });
  const searchRepo = new SearchesRepository();
  const allSearches = await searchRepo.getAllActiveSearches();
  // console.log('yerr', allSearches)

  for (let search of allSearches) {
    console.log("running scrape: ");
    console.log(search.sourceType, search.sourceOptions);
    const options = JSON.parse(search.sourceOptions);
    await scrape(search.sourceType as SourceType, options);
  }

}
