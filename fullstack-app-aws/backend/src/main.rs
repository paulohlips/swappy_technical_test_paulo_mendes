use axum::{
    http::StatusCode,
    response::IntoResponse,
    routing::get,
    Json, Router,
};
use reqwest;
use serde::{Deserialize, Serialize};
use serde_json;
use std::net::SocketAddr;
use tower_http::cors::{CorsLayer, Any};

#[derive(Debug, Deserialize, Serialize)]
struct Joke {
    categories: Vec<String>,
    created_at: String,
    icon_url: String,
    id: String,
    updated_at: String,
    url: String,
    value: String,
}

#[tokio::main]
async fn main() {
    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    let app = Router::new()
        .route("/joke", get(get_joke))
        .route("/jooke", get(bad_route))
        .fallback(handler_404)
        .layer(cors); 

    let addr = SocketAddr::from(([127, 0, 0, 1], 3000));
    println!("We are online on http://{}", addr);

    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

async fn get_joke() -> impl IntoResponse {
    let url = "https://api.chucknorris.io/jokes/random";

    match reqwest::get(url).await {
        Ok(resp) => match resp.json::<Joke>().await {
            Ok(joke) => (
                StatusCode::OK,
                Json(joke),
            )
                .into_response(),
            Err(_) => (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(serde_json::json!({ "error": "Failed to parse joke" })),
            )
                .into_response(),
        },
        Err(_) => (
            StatusCode::BAD_GATEWAY,
            Json(serde_json::json!({ "error": "Failed to reach Chuck Norris API" })),
        )
            .into_response(),
    }
}

async fn bad_route() -> impl IntoResponse {
    (
        StatusCode::UNPROCESSABLE_ENTITY,
        Json(serde_json::json!({
            "joke": "Who mispelled the api route ? You"
        })),
    )
}

async fn handler_404() -> impl IntoResponse {
    (
        StatusCode::NOT_FOUND,
        Json(serde_json::json!({
            "error": "Not Found — try /joke or /jooke"
        })),
    )
}
