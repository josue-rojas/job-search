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
}
