CREATE TABLE blogs (
  id SERIAL PRIMARY KEY,
  author VARCHAR(255),
  url VARCHAR(2048) NOT NULL,
  title VARCHAR(255) NOT NULL,
  likes INT DEFAULT 0
);

INSERT INTO blogs (author, url, title)
VALUES
  ('sahand sn', 'sahandBlog.com', 'sahand blog'),
  ('samim sn', 'samimBlog.com', 'samim blog');
  
