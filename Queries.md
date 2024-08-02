get the last 10 jobs by site source
```sql
SELECT 
    datetime(datePosted, 'localtime') as localDatePosted,
    company, 
    title, 
    link
FROM 
    jobs
WHERE 
    siteSource = 'LinkedInhttps://www.linkedin.com/jobs/search?keywords=JavaScript&location=New%20York&geoId=105080838&f_E=2%2C3%2C4&f_TPR=r86400&position=1&pageNum=0'
ORDER BY 
    localDatePosted DESC
LIMIT 20;
```
