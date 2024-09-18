import { JobsRepository } from "../repository/jobs";

export class JobService {
  jobRepo: JobsRepository;

  constructor(jobRepo: JobsRepository) {
    this.jobRepo = jobRepo;
  }
  async getJobs(limit: number, offset: number) {
    return await this.jobRepo.getJobs(limit, offset);
  }

  // get all filter types
  async getFilters() {
    const siteSources = await this.jobRepo.getUniqueSiteSources();

    return {
      siteSources,
    }
  }

  async toggleHide(jobId: number, hideValue: boolean | null = null) {
    await this.jobRepo.toggleHide(jobId, hideValue);
  }
}
