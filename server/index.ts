import express from 'express';
import { JobsRepository } from './repository/jobs';
import { JobService } from './service/jobService';
import cors from 'cors';

const app = express();
// TODO: this should be an env variable
const port = 3002;

const jobRepo = new JobsRepository();
const jobService = new JobService(jobRepo);

app.use(cors());

// API endpoint to query the database with pagination
app.get('/api/getJobs', async (req, res) => {
  const page = parseInt(req.query?.page as string) || 1;
  const pageSize = parseInt(req.query?.pageSize as string) || 10;
  const offset = (page - 1) * pageSize;

  try {
    const jobs = await jobService.getJobs(pageSize, offset);

    return res.status(200).json({
      success: true,
      data: jobs,
      offset,
      pageSize
    })
  } catch (e) {
    console.error(e);

    return res.status(500).json({ e })
  }
});

app.get('/api/getFilters', async (_req, res) => {
  try {
    const filters = await jobService.getFilters();

    return res.status(200).json({
      success: true,
      data: filters,
    })
  } catch (e) {
    console.error(e);

    return res.status(500).json({ e });
  }
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
