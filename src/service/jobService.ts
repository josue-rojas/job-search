export interface JobInterface {
  id: number;
  link: string;
  datePosted: string;
  description: string;
  company: string;
  title: string;
  siteSource: string;
}

interface GetJobsResponse {
  success: boolean;
  data: {
    rows: JobInterface[];
    count: number;
  }
  offset: number;
  pageSize: number;
}

interface GetFilterResponse {
  success: boolean;
  data: {
    siteSource: string[];
  }
}

class JobService {
  readonly apiUrl = '';

  // TODO: add try catch for errors
  async getJobs(page: number = 1, pageSize: number = 10): Promise<GetJobsResponse> {
    const fetchResponse = await fetch(this.apiUrl + `/api/getJobs?page=${page}&pageSize=${pageSize}`);
    const data = await fetchResponse.json();

    return data as GetJobsResponse;
  }

  async getFilters() {
    const fetchResponse = await fetch(this.apiUrl + '/api/getFilters');
    const data = await fetchResponse.json();

    return data as GetFilterResponse;
  }
}

export const jobService = new JobService();
