import puppeteer, { Browser, Page } from "puppeteer";
import { setTimeout } from "node:timers/promises";

export class PuppeteerFetch {
  readonly retry_attempts = 3;
  readonly retry_delay = 3000;
  readonly defaultScrollDelay = 5000;
  readonly defaultClickDelay = 2000;

  browser: Browser | undefined;
  page: Page | undefined;

  async goto(url: string) {
    const browser = await this.getBrowser();
    this.page = await browser.newPage();

    let responseStatus: number = 0;
    this.page.on('response', response => {
      const responseUrl = response.url();

      if (!['https://www.linkedin.com/li/track'].includes(responseUrl)) {
        // console.log('responding-', responseUrl, response.status())
      }

      if (responseUrl === url) {
        responseStatus = response.status();
      }
    })

    this.page.on('request', (r) => {
      const responseUrl = r.url();
      if (!['https://www.linkedin.com/li/track'].includes(responseUrl)) {
        // console.log('request-', responseUrl);
      }
    });

    this.page
    .on('console', message =>
      console.log(`${message.type()} ${message.text()}`))

    let tryNum = 0;
    // this is where we fetch and retry if it fails to fetch
    while (tryNum < this.retry_attempts && responseStatus != 200) {
      console.log('fetch attempt -', tryNum)
      await this.page.goto(url);
      tryNum++;
      await setTimeout(this.retry_delay);
    }

    if (responseStatus !== 200) {
      await browser.close();
      throw new Error(`Failed to load page, status code: ${responseStatus}`)
    }

    return this;
  }

  private async getBrowser() {
    if (!this.browser) {
      this.browser = await puppeteer.launch();
    } 

    return this.browser;
  }

  // repetetive
  // maybe this shoulld be write content to file
  async content() {
    return await this.page?.content();
  }

  async scrollToBottom(scrollDelay?: number) {
    if (!this.page) throw new Error('page not found');

    let previousHeight;
    let currentHeight = await this.page.evaluate('document.body.scrollHeight') as number;

    do {
      console.log('scroll', previousHeight)
      previousHeight = currentHeight;
      await this.page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
      await setTimeout(scrollDelay || this.defaultScrollDelay); 
      currentHeight = await this.page.evaluate('document.body.scrollHeight') as number;
    } while (currentHeight > previousHeight);
  }

  async close() {
    await this.browser?.close();
  }

  async clickShowMoreButton(buttonSelector: string, clickDelay: number = this.defaultClickDelay) {
    try {
      const button = await this.page?.waitForSelector(buttonSelector, { visible: true });
      console.log('clicking')
      await button?.click();
      await setTimeout(clickDelay); 
    } catch (error) {
      console.log('Button not found or no longer visible:', error);
      return false;
    }
    return true;
  }
}
