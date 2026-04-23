-- LinkedIn Intelligence System Database Schema
-- Optimized for PostgreSQL / MySQL / SQLite

CREATE TABLE users (
    id VARCHAR(128) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    display_name VARCHAR(255),
    photo_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE preferences (
    user_id VARCHAR(128) PRIMARY KEY REFERENCES users(id),
    domain VARCHAR(100),
    interests JSON, -- Array of strings
    automation_active BOOLEAN DEFAULT FALSE,
    start_time TIME,
    duration INTEGER, -- Minutes
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE intelligence_logs (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(128) REFERENCES users(id),
    author VARCHAR(255),
    type VARCHAR(50), -- Technical, Hiring, Motivational, Toxic
    content TEXT,
    relevance INTEGER, -- 0 to 100
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE jobs (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(128) REFERENCES users(id),
    title VARCHAR(255),
    company VARCHAR(100),
    location VARCHAR(100),
    url TEXT,
    domain VARCHAR(100),
    discovered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexing for performance
CREATE INDEX idx_logs_user_relevance ON intelligence_logs(user_id, relevance);
CREATE INDEX idx_jobs_user_domain ON jobs(user_id, domain);
