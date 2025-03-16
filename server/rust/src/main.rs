use actix_web::{get, HttpResponse, HttpServer, Responder, App};

#[get("/")]
async fn hello() -> impl Responder {
    HttpResponse::Ok().body("hello sreyas")
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    println!("Server running at : http://localhost:8000");
    HttpServer::new(|| {
        App::new().service(hello)
    })
    .bind(("127.0.0.1", 8000))? 
    .run()
    .await
}