use actix_web::{post, get, web, HttpResponse, Responder};
use serde::Deserialize; 
use crate::db::database::connect_db;
use crate::models::problem::Problem;

#[derive(Deserialize, Debug)]
struct ProblemData {
    title: String,
    description: String,
}

#[post("/problem")]
async fn add_problem(problem: web::Json<ProblemData>) -> impl Responder {
    println!("Received problem: {:?}", &problem);
    


    HttpResponse::Ok().json(serde_json::json!({
        "message": "Problem added successfully",
        "problem_title": problem.title,
        "problem_description": problem.description
    }))
}

#[get("/problem")]
async fn get_problems() -> impl Responder {
    let pool = connect_db().await;
    match sqlx::query_as!(Problem, "SELECT * FROM public.tbl_problems")
        .fetch_all(&pool)
        .await {
            Ok(problems) => {
                println!("Problems: {:?}", problems);
            },
            Err(e) => {
                println!("Error fetching problems: {:?}", e);
            }
        }
    HttpResponse::Ok().json(serde_json::json!({
        "message": "Problems fetched successfully"
    }))
}

pub fn register_routes(cfg: &mut web::ServiceConfig) {
    cfg
        .service(add_problem)
        .service(get_problems);
}