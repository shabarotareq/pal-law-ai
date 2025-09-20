CREATE TABLE cases (
  id SERIAL PRIMARY KEY,
  case_number VARCHAR(50) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  case_id INT REFERENCES cases(id) ON DELETE CASCADE,
  username VARCHAR(100),
  message TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
