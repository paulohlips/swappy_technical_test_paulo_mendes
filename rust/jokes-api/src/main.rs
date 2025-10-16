use axum::{
    body::Body,
    http::{Request, StatusCode},
    response::IntoResponse,
    routing::get,
    Json, Router,
};
use reqwest;
use serde::{Deserialize, Serialize};
use serde_json;
use std::net::SocketAddr;

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
    let app = Router::new()
        .route("/joke", get(get_joke))
        .route("/jooke", get(bad_route))
        .fallback(handler_404);

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
                Json(serde_json::json!({ "joke": joke.value })),
            ).into_response(),
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

// unit tests
#[cfg(test)]
mod tests {
    use super::*;
    use axum::body;
    use tower::ServiceExt;

    #[tokio::test]
    async fn test_bad_route() {
        let app = Router::new()
            .route("/jooke", get(bad_route))
            .fallback(handler_404);

        let response = app
            .oneshot(Request::builder().uri("/jooke").body(Body::empty()).unwrap())
            .await
            .unwrap();

        assert_eq!(response.status(), StatusCode::UNPROCESSABLE_ENTITY);

        let body_bytes = body::to_bytes(response.into_body(), usize::MAX).await.unwrap();
        let body_json: serde_json::Value = serde_json::from_slice(&body_bytes).unwrap();

        assert_eq!(
            body_json,
            serde_json::json!({"joke": "Who mispelled the api route ? You"})
        );
    }

    #[tokio::test]
    async fn test_404() {
        let app = Router::new()
            .route("/jooke", get(bad_route))
            .fallback(handler_404);

        let response = app
            .oneshot(Request::builder().uri("/notfound").body(Body::empty()).unwrap())
            .await
            .unwrap();

        assert_eq!(response.status(), StatusCode::NOT_FOUND);

        let body_bytes = body::to_bytes(response.into_body(), usize::MAX).await.unwrap();
        let body_json: serde_json::Value = serde_json::from_slice(&body_bytes).unwrap();

        assert_eq!(
            body_json,
            serde_json::json!({"error": "Not Found — try /joke or /jooke"})
        );
    }

    #[tokio::test]
    async fn test_joke_route_mock() {
        let app = Router::new()
            .route("/joke", get(|| async {
                Json(serde_json::json!({"joke": "Chuck Norris counted to infinity. Twice."}))
            }))
            .fallback(handler_404);

        let response = app
            .oneshot(Request::builder().uri("/joke").body(Body::empty()).unwrap())
            .await
            .unwrap();

        assert_eq!(response.status(), StatusCode::OK);

        let body_bytes = body::to_bytes(response.into_body(), usize::MAX).await.unwrap();
        let body_json: serde_json::Value = serde_json::from_slice(&body_bytes).unwrap();

        assert_eq!(
            body_json,
            serde_json::json!({"joke": "Chuck Norris counted to infinity. Twice."})
        );
    }

    #[tokio::test]
    async fn test_joke_route_structure() {
        let app = Router::new()
            .route("/joke", get(get_joke))
            .fallback(handler_404);

        let response = app
            .oneshot(Request::builder().uri("/joke").body(Body::empty()).unwrap())
            .await
            .unwrap();

        assert!(response.status() == StatusCode::OK || response.status() == StatusCode::BAD_GATEWAY);

        let body_bytes = body::to_bytes(response.into_body(), usize::MAX).await.unwrap();
        let body_json: serde_json::Value = serde_json::from_slice(&body_bytes).unwrap();

        assert!(body_json.get("joke").is_some() || body_json.get("error").is_some());
    }
}
