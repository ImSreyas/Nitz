mod db;
mod models;
mod api;
use actix_web::{get, HttpResponse, HttpServer, Responder, App};

#[get("/")]
async fn hello() -> impl Responder {
    HttpResponse::Ok().body("hello sreyas")
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    println!("Server running at : http://localhost:8000");
    HttpServer::new(|| {
        App::new()
            .service(hello)
            .configure(api::register_api_routes)
    })
    .bind(("127.0.0.1", 8000))?
    .run()
    .await
}