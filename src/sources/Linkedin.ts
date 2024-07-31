import { SourceBase } from "./SourceBase";
import puppeteer from 'puppeteer';
import {setTimeout} from "node:timers/promises";


interface LinkedInDataType {
  link: string;
  title: string;
  datePosted: string;
}

export class LinkedIn extends SourceBase<LinkedInDataType[]> {
  name = 'LinkedIn';
  url = 'https://www.linkedin.com/jobs/search/?f_E=2%2C3%2C4&f_TPR=r86400&geoId=105080838&keywords=software%2Bengineer&location=New%2BYork%2C%2BUnited%2BStates&origin=JOB_SEARCH_PAGE_SEARCH_BUTTON&refresh=false&position=1&pageNum=0&original_referer='

  async fetch() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(this.url);
    const button = page.locator('button .infinite-scroller__show-more-button.infinite-scroller__show-more-button--visible')

    const showMoreButtonSelector = 'button.infinite-scroller__show-more-button.infinite-scroller__show-more-button--visible';

    // Function to scroll to the bottom of the page
    async function scrollToBottom() {
      let previousHeight;
      let currentHeight = await page.evaluate('document.body.scrollHeight') as number;

      do {
        console.log('---scrolling---', previousHeight)
        previousHeight = currentHeight;
        await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
        await setTimeout(2000); // Adjust the timeout based on your observation of how long it takes for data to load
        currentHeight = await page.evaluate('document.body.scrollHeight') as number;
      } while (currentHeight > previousHeight);
    }

    // Function to click the button and wait for more data to load
    async function clickShowMoreButton() {
      try {
        console.log('---clicking button---')
        // await page.waitForSelector(showMoreButtonSelector, { visible: true });
        await page.locator(showMoreButtonSelector).click();
        await setTimeout(2000); // Adjust the timeout based on your observation of how long it takes for data to load
      } catch (error) {
        console.log('Button not found or no longer visible:', error);
        return false;
      }
      return true;
    }

    let buttonExists = true;
    while (buttonExists) {
      await scrollToBottom();
      buttonExists = await clickShowMoreButton();
    }
  
    console.log('button', button)
    const extractedData = await page.$$eval('.jobs-search__results-list li .base-card', (elements) => {
      return elements.map((el) => {
        const link = el.querySelector('.base-card__full-link')?.['href'] as string;
        const title = el.querySelector('.base-search-card__title')?.innerHTML as string;
        const datePosted = el.querySelector('time')?.getAttribute('datetime') as string;

        return {
          link,
          title,
          datePosted
      };
      })
    })
    await browser.close();

    // console.log('-0---', JSON.stringify(extractedData))

    return extractedData
  }

  mapData(data: LinkedInDataType[]) {
    return { 
      data: data.map(l => ({
        link: l.link.split('?')[0],
        datePosted: l.datePosted,
        description: '',
        title: l.title.trim()
      })),
      source: this.name,
    }
  }
}
