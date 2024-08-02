get the last 20 jobs by site source
```sql
SELECT 
    datetime(datePosted, 'localtime') as localDatePosted,
    siteSource,
    company, 
    title, 
    link
FROM 
    jobs
-- WHERE 
    -- siteSource = 'LinkedInJavaScript'
ORDER BY 
    localDatePosted DESC
LIMIT 20;
```

delete all jobs from db (!!!!)
```sql
DELETE FROM jobs;
```
