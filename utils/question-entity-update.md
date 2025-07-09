-- Updated Question Entity Schema for PostgreSQL
-- This includes all the latest changes for handling different answer types and poster missions

-- First, let's create/update the main questions table
CREATE TABLE IF NOT EXISTS questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Basic Properties
    question_type_id VARCHAR(1) NOT NULL CHECK (question_type_id IN ('S', 'L', 'M', 'P', 'W', 'R', 'N', 'U')),
    description TEXT,
    question TEXT NOT NULL,
    hint TEXT,
    sequence INTEGER NOT NULL DEFAULT 1,
    
    -- Mission Type
    mission_type VARCHAR(20) NOT NULL CHECK (mission_type IN ('quiz', 'survey', 'assessment', 'poster')),
    
    -- Answer Configuration
    has_correct_answer BOOLEAN NOT NULL DEFAULT FALSE,
    correct_answer JSONB, -- Stores the correct answer(s) in various formats
    user_answer JSONB, -- Stores user's response
    
    -- Poster-specific properties (only used when mission_type is 'poster')
    position JSONB, -- { "x": number, "y": number }
    input_dimensions JSONB, -- { "width": number, "height": number }
    style JSONB, -- Complete styling object for poster questions
    
    -- Question Type Specific Properties
    character_limit INTEGER DEFAULT 100,
    placeholder TEXT,
    
    -- Multiple Choice & Image Choice
    options JSONB DEFAULT '[]'::jsonb, -- Array of option objects
    allow_multiple_selection BOOLEAN DEFAULT FALSE,
    image_options JSONB DEFAULT '[]'::jsonb, -- Array of image option objects
    
    -- Sorting
    sorting_items JSONB DEFAULT '[]'::jsonb, -- Array of sorting item objects
    
    -- Rating (Star & Number)
    max_rating INTEGER DEFAULT 5,
    min_rating INTEGER DEFAULT 1,
    
    -- User Search
    user_search_config JSONB DEFAULT '{}'::jsonb,
    
    -- Validation and Scoring
    is_required BOOLEAN DEFAULT TRUE,
    points INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID, -- Reference to user who created the question
    
    -- Constraints
    CONSTRAINT valid_poster_properties CHECK (
        (mission_type != 'poster') OR 
        (mission_type = 'poster' AND question_type_id IN ('S', 'L'))
    ),
    CONSTRAINT valid_correct_answer CHECK (
        (NOT has_correct_answer AND correct_answer IS NULL AND points = 0) OR
        (has_correct_answer AND correct_answer IS NOT NULL)
    )
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_questions_mission_type ON questions(mission_type);
CREATE INDEX IF NOT EXISTS idx_questions_question_type ON questions(question_type_id);
CREATE INDEX IF NOT EXISTS idx_questions_sequence ON questions(sequence);
CREATE INDEX IF NOT EXISTS idx_questions_created_at ON questions(created_at);

-- Create a separate table for question metadata (optional, for additional organization)
CREATE TABLE IF NOT EXISTS question_metadata (
    question_id UUID PRIMARY KEY REFERENCES questions(id) ON DELETE CASCADE,
    tags TEXT[] DEFAULT '{}',
    category VARCHAR(100),
    difficulty VARCHAR(20) CHECK (difficulty IN ('easy', 'medium', 'hard')),
    estimated_time INTEGER DEFAULT 0, -- in seconds
    analytics_enabled BOOLEAN DEFAULT TRUE,
    custom_properties JSONB DEFAULT '{}'::jsonb
);

-- Migration script to update existing questions table
-- WARNING: Review and test this migration on a copy of your database first!

-- Step 1: Add new columns (if they don't exist)
DO $$ 
BEGIN
    -- Add mission_type if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'questions' AND column_name = 'mission_type') THEN
        ALTER TABLE questions ADD COLUMN mission_type VARCHAR(20) DEFAULT 'survey';
        ALTER TABLE questions ADD CONSTRAINT check_mission_type CHECK (mission_type IN ('quiz', 'survey', 'assessment', 'poster'));
    END IF;
    
    -- Add answer configuration columns
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'questions' AND column_name = 'has_correct_answer') THEN
        ALTER TABLE questions ADD COLUMN has_correct_answer BOOLEAN DEFAULT FALSE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'questions' AND column_name = 'correct_answer') THEN
        ALTER TABLE questions ADD COLUMN correct_answer JSONB;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'questions' AND column_name = 'user_answer') THEN
        ALTER TABLE questions ADD COLUMN user_answer JSONB;
    END IF;
    
    -- Add points column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'questions' AND column_name = 'points') THEN
        ALTER TABLE questions ADD COLUMN points INTEGER DEFAULT 0;
    END IF;
    
    -- Modify existing answer column (if it exists) - you might want to migrate data first
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'questions' AND column_name = 'answer') THEN
        -- Migrate existing answer data to correct_answer where appropriate
        -- UPDATE questions SET correct_answer = to_jsonb(answer) WHERE answer IS NOT NULL;
        -- Then drop the old column after data migration
        -- ALTER TABLE questions DROP COLUMN answer;
        
        -- For now, just rename it to avoid conflicts
        ALTER TABLE questions RENAME COLUMN answer TO old_answer;
    END IF;
END $$;

-- Step 2: Update existing data based on your business logic
-- Example migration of existing data (customize based on your needs):

-- Set mission types based on existing data patterns
-- UPDATE questions SET mission_type = 'quiz' WHERE /* your quiz identification logic */;
-- UPDATE questions SET mission_type = 'survey' WHERE /* your survey identification logic */;
-- UPDATE questions SET mission_type = 'assessment' WHERE /* your assessment identification logic */;

-- Set has_correct_answer based on question types
UPDATE questions SET 
    has_correct_answer = CASE 
        WHEN question_type_id IN ('M', 'P', 'W') THEN TRUE  -- Multiple choice, Image choice, Sorting typically have correct answers
        WHEN question_type_id IN ('S', 'L') AND mission_type IN ('quiz', 'assessment') THEN TRUE
        ELSE FALSE
    END
WHERE has_correct_answer IS NULL;

-- Migrate points for questions with correct answers
UPDATE questions SET 
    points = CASE 
        WHEN has_correct_answer = TRUE AND question_type_id IN ('M', 'P') THEN 10
        WHEN has_correct_answer = TRUE AND question_type_id = 'W' THEN 15
        WHEN has_correct_answer = TRUE AND question_type_id IN ('R', 'N', 'U') THEN 5
        ELSE 0
    END
WHERE points = 0;

-- Create trigger for updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_questions_updated_at ON questions;
CREATE TRIGGER update_questions_updated_at 
    BEFORE UPDATE ON questions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Sample data insertion examples
INSERT INTO questions (
    question_type_id,
    description,
    question,
    hint,
    sequence,
    mission_type,
    has_correct_answer,
    correct_answer,
    points,
    options,
    character_limit,
    placeholder
) VALUES 
-- Survey question (open-ended)
(
    'S',
    'Basic information gathering',
    'What is your favorite color?',
    'Enter a single word or short phrase',
    1,
    'survey',
    FALSE,
    NULL,
    0,
    '[]'::jsonb,
    50,
    'e.g., Blue, Red, Green'
),
-- Quiz question (has correct answer)
(
    'M',
    'Knowledge assessment',
    'Which of the following are programming languages?',
    'Select all that apply',
    2,
    'quiz',
    TRUE,
    '["1", "2", "4"]'::jsonb,
    10,
    '[
        {"id": "1", "text": "JavaScript", "isCorrect": true},
        {"id": "2", "text": "Python", "isCorrect": true},
        {"id": "3", "text": "HTML", "isCorrect": false},
        {"id": "4", "text": "Java", "isCorrect": true},
        {"id": "5", "text": "CSS", "isCorrect": false}
    ]'::jsonb,
    NULL,
    NULL
),
-- Poster question (with position and styling)
(
    'S',
    'Poster feedback - short',
    'What''s your main takeaway from this poster?',
    'One key insight or message',
    1,
    'poster',
    FALSE,
    NULL,
    0,
    '[]'::jsonb,
    100,
    'Your key insight...'
);