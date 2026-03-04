-- AI Interview Coach - MySQL schema for scheduling, AI interview flow, evaluation, and reporting

CREATE DATABASE IF NOT EXISTS ai_interview_coach;
USE ai_interview_coach;

CREATE TABLE IF NOT EXISTS candidates (
  candidate_id VARCHAR(64) PRIMARY KEY,
  candidate_name VARCHAR(120) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  mobile VARCHAR(25),
  country VARCHAR(80),
  resume_skills JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS interview_schedule (
  schedule_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  candidate_id VARCHAR(64) NOT NULL,
  scheduled_date DATE NOT NULL,
  scheduled_time VARCHAR(20) NOT NULL,
  timezone VARCHAR(60) DEFAULT 'Asia/Kolkata',
  meet_link VARCHAR(255),
  reminder_sent TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (candidate_id) REFERENCES candidates(candidate_id)
);

CREATE TABLE IF NOT EXISTS calendar_events (
  calendar_event_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  schedule_id BIGINT NOT NULL,
  provider ENUM('GOOGLE','OUTLOOK','ICS') DEFAULT 'GOOGLE',
  external_event_id VARCHAR(200),
  event_url VARCHAR(500),
  sync_status ENUM('SYNCED','FAILED','PENDING') DEFAULT 'PENDING',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (schedule_id) REFERENCES interview_schedule(schedule_id)
);

CREATE TABLE IF NOT EXISTS interview_sessions (
  session_id VARCHAR(64) PRIMARY KEY,
  candidate_id VARCHAR(64) NOT NULL,
  candidate_name VARCHAR(120) NOT NULL,
  status ENUM('IN_PROGRESS','COMPLETED','CLOSED') DEFAULT 'IN_PROGRESS',
  started_at DATETIME NOT NULL,
  completed_at DATETIME NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (candidate_id) REFERENCES candidates(candidate_id)
);

CREATE TABLE IF NOT EXISTS interview_questions (
  question_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  session_id VARCHAR(64) NOT NULL,
  candidate_id VARCHAR(64) NOT NULL,
  candidate_name VARCHAR(120) NOT NULL,
  question_text TEXT NOT NULL,
  question_type ENUM('CONCEPTUAL','SCENARIO','CODING') NOT NULL,
  difficulty ENUM('EASY','MEDIUM','HARD') DEFAULT 'MEDIUM',
  source_skill VARCHAR(120),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES interview_sessions(session_id),
  FOREIGN KEY (candidate_id) REFERENCES candidates(candidate_id)
);

CREATE TABLE IF NOT EXISTS interview_answers (
  answer_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  session_id VARCHAR(64) NOT NULL,
  question_id BIGINT NOT NULL,
  candidate_id VARCHAR(64) NOT NULL,
  answer_text LONGTEXT,
  answer_code LONGTEXT,
  input_type ENUM('TEXT','VOICE','CODE') NOT NULL,
  stt_transcript LONGTEXT,
  answered_at DATETIME NOT NULL,
  FOREIGN KEY (session_id) REFERENCES interview_sessions(session_id),
  FOREIGN KEY (question_id) REFERENCES interview_questions(question_id),
  FOREIGN KEY (candidate_id) REFERENCES candidates(candidate_id)
);

CREATE TABLE IF NOT EXISTS answer_evaluations (
  evaluation_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  answer_id BIGINT NOT NULL,
  technical_accuracy DECIMAL(5,2) NOT NULL,
  depth_score DECIMAL(5,2) NOT NULL,
  problem_solving_score DECIMAL(5,2) NOT NULL,
  communication_score DECIMAL(5,2) NOT NULL,
  overall_score DECIMAL(5,2) NOT NULL,
  feedback TEXT,
  improvement_suggestions TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (answer_id) REFERENCES interview_answers(answer_id)
);

CREATE TABLE IF NOT EXISTS integrity_flags (
  integrity_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  session_id VARCHAR(64) NOT NULL,
  candidate_id VARCHAR(64) NOT NULL,
  signal_type ENUM('TAB_SWITCH','INACTIVITY','SUSPICIOUS') NOT NULL,
  severity ENUM('LOW','MEDIUM','HIGH') NOT NULL,
  description VARCHAR(255),
  occurred_at DATETIME NOT NULL,
  FOREIGN KEY (session_id) REFERENCES interview_sessions(session_id),
  FOREIGN KEY (candidate_id) REFERENCES candidates(candidate_id)
);

CREATE TABLE IF NOT EXISTS interview_reports (
  report_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  session_id VARCHAR(64) NOT NULL UNIQUE,
  candidate_id VARCHAR(64) NOT NULL,
  overall_score_percentage DECIMAL(5,2) NOT NULL,
  integrity_score_percentage DECIMAL(5,2) NOT NULL,
  weak_areas TEXT,
  generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES interview_sessions(session_id),
  FOREIGN KEY (candidate_id) REFERENCES candidates(candidate_id)
);

CREATE TABLE IF NOT EXISTS candidate_todo_items (
  todo_id BIGINT AUTO_INCREMENT PRIMARY KEY,
  report_id BIGINT NOT NULL,
  candidate_id VARCHAR(64) NOT NULL,
  todo_text VARCHAR(300) NOT NULL,
  is_completed TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (report_id) REFERENCES interview_reports(report_id),
  FOREIGN KEY (candidate_id) REFERENCES candidates(candidate_id)
);

CREATE INDEX idx_session_candidate ON interview_sessions(candidate_id, status);
CREATE INDEX idx_question_session ON interview_questions(session_id);
CREATE INDEX idx_answer_session ON interview_answers(session_id);
CREATE INDEX idx_integrity_session ON integrity_flags(session_id);
