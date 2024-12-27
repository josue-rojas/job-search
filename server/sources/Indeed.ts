import { PuppeteerFetch } from "../utils/puppeteerFetch";
import { JobInterface, SourceBase, SourceData } from "./SourceBase";

export interface IndeedOptions {
  keyword: string;
  location: string;
  datePosted?: number;
}

interface IndeedDataType {
  link: string;
  title: string;
  datePosted: string;
  company: string;
}

export class Indeed extends SourceBase<IndeedDataType[]> {
  readonly clickDelay = 2000;
  name = 'Indeed';
  url: string = '';
  maxScrollCount = 100;
  

  constructor({ keyword, location, datePosted }: IndeedOptions) {
    super();
    const keywordEncoded = encodeURIComponent(keyword);
    const locationEncoded = encodeURIComponent(location);
    const datePostedEncoded = datePosted ? `fromage=${datePosted}` : 'fromage=1';

    this.url = 'https://www.indeed.com/jobs?' +
      `q=${keywordEncoded}` +
      `&l=${locationEncoded}` +
      '&sc=0kf%3Aattr%28PAXZC%29%3B' + // this is part of the fixed URL for filtering by specific attributes
      `&${datePostedEncoded}` +
      '&sort=date';
  }

  get SourceName(): string {
    const keywordRegex = /q=([a-zA-Z%\d]+)/;
    return this.name + this.url.match(keywordRegex)?.[1] || 'unknown';
  }

  async fetch() {
    // console.log('Fetching for', this.SourceName);
    // console.log('url', this.url)
    // const puppeteerFetch = (await new PuppeteerFetch().goto('https://indeed.com'));

    // await puppeteerFetch.saveHTML(this.SourceName);

    // const data = await puppeteerFetch.page?.evaluate(`
    //   window.mosaic.providerData["mosaic-provider-jobcards"].metaData
    // `);

    // console.log('data', data)

    // if (!puppeteerFetch.page) {
    //   return [];
    // }


    return [];
  }

  mapData(_data: IndeedDataType[]): SourceData {
    return {
      data: [] as unknown as JobInterface[],
      siteSource: this.SourceName,
    }
  }

  static isType(obj: any): obj is IndeedOptions {
    return typeof obj === 'object' &&
    obj !== null &&
    typeof obj.keyword === 'string' &&
    typeof obj.location === 'string' &&
    (obj.datePosted === undefined || typeof obj.datePosted === 'number');
  }

}
