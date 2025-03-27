use actix_web::web;

pub mod moderator;
// pub mod user;

pub fn register_api_routes(cfg: &mut web::ServiceConfig) {
  cfg.service(web::scope("/api")
    .configure(moderator::register_routes)
  );
}