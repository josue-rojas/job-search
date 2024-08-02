# job-notifier
Scrape for new jobs and notify when new ones are found

# Requirements
- [sqlite ](https://www.sqlite.org)/
- node 21 (`nvm use` if nvm available)


# Getting Started
- Clone this repo
- Run `npm install`
- .... Run `npm run dev` runs the script as is
- jobs might not show up (working on adding a front end piece) but you can view them on sqlite using the queries from `Queries.md`

# TODO
- how do we get data? design of how we get the latest data;
- the query to get the latest jobs should be configurable
- create filters for jobs to remove jobs that might not be relevant or companies that arent relevant to you
