import express from 'express';

const app = express();
// TODO: this should be an env variable
const port = 3000;

// API endpoint to query the database with pagination
app.get('/api/getJobs', (req, res) => {
  const page = parseInt(req.query?.page as string) || 1;
  const pageSize = parseInt(req.query?.pageSize as string) || 10;
  const offset = (page - 1) * pageSize;

  return res.status(200).json({
    success: true,
    data: [],
    offset,
    pageSize
  })

});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
