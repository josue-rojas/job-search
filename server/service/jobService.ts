import { JobsRepository } from "../repository/jobs";

export class JobService {
  jobRepo: JobsRepository;

  constructor(jobRepo: JobsRepository) {
    this.jobRepo = jobRepo;
  }
  async getJobs(limit: number, offset: number, hideFilter: boolean | null, sourceTypes: string[] | null) {
    return await this.jobRepo.getJobs(limit, offset, hideFilter, sourceTypes);
  }

  // get all filter types
  async getFilters() {
    const siteSources = await this.jobRepo.getUniqueSiteSources();

    return {
      siteSources,
      hide: ['true', 'false'],
    }
  }

  async toggleHide(jobId: number, hideValue: boolean | null = null) {
    await this.jobRepo.toggleHide(jobId, hideValue);
  }
}
