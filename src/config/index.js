export const ENDPOINT = "http://34.101.115.25:8080"
export const ENDPOINT_BACKEND = `${ENDPOINT}/api`
export const ENDPOINT_ASSETS = `${ENDPOINT}/images`
export const BEARER_TOKEN = {
    'Authorization': "Bearer " + localStorage.getItem("authToken") || ""
}