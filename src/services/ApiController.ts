const API_URL = "http://localhost:3000/api/";

function fetchCall<T>(url: string): Promise<{data: T}> {
    return fetch(url)
    .then(res => res.json())
    .catch(() => {
        throw {
            errors: [
                {
                    status: 500,
                    message: "An error has ocurred in the server. Please try again later."
                }
            ]
        }
    });
}

export default {
    get<T>(url: string) {
        return fetchCall<T>(API_URL + url);
    }
}