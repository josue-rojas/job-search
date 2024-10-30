import { SourceBase, SourceData } from "./SourceBase";
import { PuppeteerFetch } from "../utils/puppeteerFetch";

interface LinkedInPostDataType {
  link: string;
  title: string;
  datePosted: string;
  company: string
}

export interface LinkeInPostOptions {

}

// TODO: need to figure out how to sign in so we dont get a 302

export class LinkedInPost extends SourceBase<LinkedInPostDataType[]> {
  name = 'LinkedInPost';
  url: string = '';

  constructor({ }: LinkeInPostOptions) {
    super();

    // TODO: make this config
    this.url = 'https://www.linkedin.com/search/results/content/?datePosted=%22past-24h%22&keywords=we%20are%20hiring%20software%20engineer%20ny&origin=FACETED_SEARCH&sid=%2CHs';
  }

  get SourceName(): string {
    const keywordRegex = /keywords=([a-zA-Z%\d]+)/;
    return this.name + this.url.match(keywordRegex)?.[1].substring(0, 32) || 'unknown'
  }

  async fetch() {
    console.log('Fetching from ', this.url);

    const puppeteerFetch = (await new PuppeteerFetch().goto(this.url));

    if (!puppeteerFetch.page) {
      return [];
    }

    // for debugging purposes we save the html
    await puppeteerFetch.saveHTML(this.SourceName);

    const extractedData = await puppeteerFetch.page.$$eval('.reusable-search__entity-result-list li.artdeco-card', (el) => {
      return el.map((li) => {
        const link = (li.querySelector('.feed-shared-update-v2') as any);
        console.log(link)
      })
    })




    return []
  }

  mapData(_data: LinkedInPostDataType[]): SourceData {
    return {
      siteSource: this.SourceName,
      data: []
    };
  }

}

// const test = new LinkedInPost({});
// test.fetch().then(console.log)
