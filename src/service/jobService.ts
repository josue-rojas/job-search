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

interface ToggleHideResponse {
  success: boolean;
  message: string;
}

class JobService {
  readonly apiUrl = '';

  constructor() {
    // scoping issues when used in certain parts of the app. this makes sure this is this class
    this.toggleHide = this.toggleHide.bind(this);
  }

  // TODO: add try catch for errors
  async getJobs(page: number = 1, pageSize: number = 20): Promise<GetJobsResponse> {
    const fetchResponse = await fetch(this.apiUrl + `/api/getJobs?page=${page}&pageSize=${pageSize}`);
    const data = await fetchResponse.json();

    return data as GetJobsResponse;
  }

  async getFilters() {
    const fetchResponse = await fetch(this.apiUrl + '/api/getFilters');
    const data = await fetchResponse.json();

    return data as GetFilterResponse;
  }

  async toggleHide(jobId: number, hide?: boolean): Promise<ToggleHideResponse> {
    const fetchResponse = await fetch(`${this.apiUrl}/api/toggleHide`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jobId,
        hide,
      }),
    });
    const data = await fetchResponse.json();


    return data as ToggleHideResponse;
  }
}

export const jobService = new JobService();
