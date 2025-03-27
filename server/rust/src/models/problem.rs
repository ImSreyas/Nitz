use serde::{Serialize, Deserialize};
use uuid::Uuid;
use sqlx::FromRow;
use chrono::NaiveDateTime;
use uuid::Uuid;

#[derive(Serialize, Deserialize)]
pub struct TestCase {
    pub input: String,
    pub output: String,
    pub explanation: Option<String>,
}

#[derive(Debug, Serialize, FromRow)]
pub struct Problem {
    id: Uuid,
    problem_number: i32,
    title: String,
    difficulty: String, 
    problem_type: String, 
    competition_mode: String, 
    topics: Vec<String>, 
    problem_statement: String,
    constraints: String,
    time_limit: String,
    memory_limit: String,
    input_format: String,
    output_format: String,
    moderator_id: Uuid,
    created_at: NaiveDateTime,
}