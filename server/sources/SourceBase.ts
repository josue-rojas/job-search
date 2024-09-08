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

  static isType<ObjectType>(obj: any): obj is ObjectType {
    throw new Error('Method not implemented. Use derived class');
  }

}
