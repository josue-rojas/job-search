# job-searches
Scrape for new jobs and display them on a react web page

The idea is that some job boards (linkedin) are filled with "promoted" jobs when searching for recently posted jobs. This tool just helps find those new jobs faster and more automize.

# Requirements
- [sqlite ](https://www.sqlite.org)
- node 21 (`nvm use` if nvm available)


# Getting Started
- Clone this repo
- Run `npm install`
- .... Run `npm run dev` runs the script as is
- jobs might not show up (working on adding a front end piece) but you can view them on sqlite using the queries from `Queries.md`

Running scrape
- on `server/scrape.ts` the bottom function runs the different scrapes
- you can change the source and options for each scrape
- you can check `server/sources/$SOURCE` for specific options a scrape configuration takes. 
- after making changes (or not) you can run `npm run scrape` to start scraping process. 

# Adding more sources
- create another file in `server/sources/`
- extend the base `SourceBase` class
- implement fetch (does the main scrape or fetch from an api)
- implement mapData - takes in the fetch data return the expected `SourceData`
- implement `getSourceName` - used for storing into sqlite db
- implement `name` - a string name for the source
- test using the `server/scrape.ts` 

## Notes
Url Structure
(Note: these arent all the query params that may exist it's just the ones that we have documented. They are subject to change by LinkedIn)
https://www.linkedin.com/jobs/search/? - baseurl 
currentJobId=3997599109 - job id to show
&f_E=2%2C3%2C4 - experience level, they are a list of numbers (uri encoded)
&f_TPR=r86400 - date posted (time in seconds)
&geoId=102490898 - id location 
&keywords=software%20engineer - job search keywords (uri encoded)
&origin=JOB_SEARCH_PAGE_JOB_FILTER - I think this is for tracking on linkedin side (assuming from the name), it doesnt affect search
