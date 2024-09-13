CREATE TABLE jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    link TEXT UNIQUE,
    datePosted TEXT, -- Store date in ISO 8601 format
    updatedDate TEXT, -- Store date in ISO 8601 format
    description TEXT,
    company TEXT,
    title TEXT,
    siteSource TEXT,
    hide BOOLEAN
);


CREATE TABLE searches (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sourceType TEXT,
  sourceOptions TEXT -- This is a json
);
