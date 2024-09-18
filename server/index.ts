import express from 'express';
import { JobsRepository } from './repository/jobs';
import { JobService } from './service/jobService';
import cors from 'cors';
import { scrapeOrchestrator } from './scrape';

const app = express();
// TODO: this should be an env variable
const port = 3002;

const jobRepo = new JobsRepository();
const jobService = new JobService(jobRepo);

app.use(cors());
app.use(express.json());


// API endpoint to query the database with pagination
app.get('/api/getJobs', async (req, res) => {
  const page = parseInt(req.query?.page as string) || 1;
  const pageSize = parseInt(req.query?.pageSize as string) || 10;
  const offset: number = (page - 1) * pageSize;

  const hideFilter = req.query.hide === 'true' ? true : (req.query.hide === 'false' ? false : null);
  
  // Split the sourceType string into an array if provided
  const sourceTypes = req.query.sourceType ? (req.query.sourceType as string).split(',') : null;

  try {
    const jobs = await jobService.getJobs(pageSize, offset, hideFilter, sourceTypes);

    return res.status(200).json({
      success: true,
      data: jobs,
      offset,
      pageSize
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ e });
  }
});

app.get('/api/getFilters', async (_req, res) => {
  try {
    const filters = await jobService.getFilters();

    return res.status(200).json({
      success: true,
      data: filters,
    });
  } catch (e) {
    console.error(e);

    return res.status(500).json({ e });
  }
});

app.post('/api/toggleHide', async (req, res) => {
  const { jobId, hide } = req.body || {};

  if (!jobId) {
    return res.status(400).json({ success: false, message: 'jobId is required' });
  }

  try {
    await jobService.toggleHide(jobId, hide !== undefined ? hide : null);

    return res.status(200).json({ success: true, message: `Job ${jobId} hide status updated` });
  } catch (e) {
    console.error(e);

    return res.status(500).json({ success: false, message: 'An error occurred', error: e });
  }
});

// endpoint to force all scrapes
app.get('/api/scrape', async (_req, res) => {
  scrapeOrchestrator(); // no await to just let it run
  return res.status(200).json({ success: true });
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

setInterval(async () => {
  console.log('running scrape');
  await scrapeOrchestrator();
}, 1800000)
