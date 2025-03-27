use actix_web::web;

pub mod problem;

pub fn register_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(web::scope("/moderator")
        .configure(problem::register_routes)
    );
}