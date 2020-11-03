const API_URL = "http://localhost:3000/api/";

function fetchCall<T>(url: string, options = {}): Promise<{data: T}> {
    return fetch(url, options)
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

interface callOptions {
    body: object
}

export default {
    get<T>(url: string) {
        return fetchCall<T>(API_URL + url);
    },
    post<T>(url: string, options: callOptions) {
	const newOptions = {
	    body: JSON.stringify(options.body),
	    method: "POST",
	    headers: {
		"Content-Type": "application/json"
	    }
	}

	return fetchCall<T>(API_URL + url, newOptions);
    }
}
