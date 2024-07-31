export interface SourceData {
  data: {
    link: string;
    datePosted: string;
    description?: string;
    title: string;
  }[];
  source: string;
}

export abstract class SourceBase<FetchData = unknown> {
  abstract name: string;
  abstract fetch(): Promise<FetchData>;
  abstract mapData(data: FetchData): SourceData;
}
