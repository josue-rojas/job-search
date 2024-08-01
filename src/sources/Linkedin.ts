import { SourceBase } from "./SourceBase";
const fs = require('fs');
import { PuppeteerFetch } from "../utils/puppeteerFetch";



interface LinkedInDataType {
  link: string;
  title: string;
  datePosted: string;
  company: string;
}

export class LinkedIn extends SourceBase<LinkedInDataType[]> {
  readonly clickDelay = 2000;
  name = 'LinkedIn';
  // url = 'https://www.linkedin.com/jobs/search/?f_E=2%2C3%2C4&f_TPR=r86400&geoId=105080838&keywords=software%2Bengineer&location=New%2BYork%2C%2BUnited%2BStates&origin=JOB_SEARCH_PAGE_SEARCH_BUTTON&refresh=false&position=1&pageNum=0&original_referer='
  
  // url = 'https://www.linkedin.com/jobs/search?keywords=Typescript&location=New%20York&geoId=105080838&f_E=2%2C3%2C4&f_TPR=r86400&original_referer=https%3A%2F%2Fwww.linkedin.com%2Fjobs%2Fsearch%3Fkeywords%3DTypescript%26location%3DNew%2520York%26geoId%3D105080838%26f_TPR%3D%26f_E%3D2%252C3%252C4%26position%3D1%26pageNum%3D0&position=1&pageNum=0'
  url = 'https://www.linkedin.com/jobs/search?keywords=JavaScript&location=New%20York&geoId=105080838&f_E=2%2C3%2C4&f_TPR=r86400&position=1&pageNum=0';

  async fetch() {
    const puppeteerFetch = (await new PuppeteerFetch().goto(this.url));

    if (!puppeteerFetch.page) {
      return [];
    }

    const showMoreButtonSelector = 'button.infinite-scroller__show-more-button.infinite-scroller__show-more-button--visible';

    let buttonExists = true;
    while (buttonExists) {
      await puppeteerFetch.scrollToBottom();
      buttonExists = await puppeteerFetch.clickShowMoreButton(showMoreButtonSelector);
    }

    const html = await puppeteerFetch.content();
    fs.writeFileSync('./page.html', html);
    
    const extractedData = await puppeteerFetch.page?.$$eval('.jobs-search__results-list li .base-card', (elements) => {
      return elements.map((el) => {
        const link = el.querySelector('.base-card__full-link')?.['href'] as string;

        const title = el.querySelector('.base-search-card__title')?.innerHTML as string;
        const company = el.querySelector('.base-search-card__subtitle a')?.innerHTML as string;
        const datePostedHtml = el.querySelector('time')?.getAttribute('datetime') as string;
        const datePostedPassed = (el.querySelector('time')?.innerHTML as string).trim().split(' ');
        let subtractBy: {[k: string]: number} = {
          hours: 0,
          minutes: 0,
          seconds: 0,
        }

        
        // TODO: there is an "hour" for single hour that we  dont account for
        subtractBy[datePostedPassed[1]] = parseInt(datePostedPassed[0]) || 0;
        const datePosted = new Date(datePostedHtml);
        datePosted.setHours(datePosted.getHours() - (subtractBy.hours));
        datePosted.setMinutes(datePosted.getMinutes() - (subtractBy.minutes));
        datePosted.setSeconds(datePosted.getSeconds() - (subtractBy.seconds));

        return {
          link,
          title,
          datePosted: datePosted.toISOString(),
          company
        };
      })
    })
    await puppeteerFetch.close();

    return extractedData
  }

  mapData(data: LinkedInDataType[]) {
    // console.log(data)
    return { 
      // data: [{
      //   link: 'unkonwn',
      //   datePosted: new Date().toISOString(),
      //   description: '',
      //   title: '',
      //   company: '',
      // }],
      data: data.map(l => {
        const jobPath = l?.link?.split('?')[0].split('-');
        // console.log(l.link, jobPath)
        const jobId = jobPath[jobPath.length - 1];
        // console.log('`https://www.linkedin.com/jobs/view/${jobId}`', `https://www.linkedin.com/jobs/view/${jobId}`)
        return ({
        link: `https://www.linkedin.com/jobs/view/${jobId}`,
        datePosted: l.datePosted,
        description: '',
        title: l.title.trim(),
        company: l.company.trim(),
      })}),
      source: this.name,
    }
  }
}
