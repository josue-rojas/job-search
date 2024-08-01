export interface JobInterface {
  link: string;
  datePosted: string;
  description: string;
  title: string;
  company: string;
}
export interface SourceData {
  data: JobInterface[];
  source: string;
}

export abstract class SourceBase<FetchData = unknown> {
  abstract name: string;
  abstract fetch(): Promise<FetchData>;
  abstract mapData(data: FetchData): SourceData;
}
