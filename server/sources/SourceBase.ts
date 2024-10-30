import { VERBOSE } from "../constants/config";

export interface JobInterface {
  link: string;
  datePosted: string;
  description: string;
  title: string;
  company: string;
  hide: boolean;
  updatedDate: string;
}
export interface SourceData {
  data: JobInterface[];
  siteSource: string;
}

type SourceOptions = any;

export abstract class SourceBase<FetchData = unknown> {
  abstract name: string;
  abstract fetch(): Promise<FetchData>;
  abstract mapData(data: FetchData): SourceData;
  abstract get SourceName(): string;

  logEvent(...arg: unknown[]) {
    if (VERBOSE) {
      console.log(this.name, ...arg)
    }
  }

  static isType(obj: any): obj is SourceOptions {
    throw new Error('Method not implemented. Use derived class');
  }

}
