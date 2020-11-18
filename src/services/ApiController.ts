const API_URL = "http://localhost:3000/api/";

async function fetchCall<T>(url: string, options = {}): Promise<T> {
    try {
	const res = await fetch(url, options)

	return res.json();
    } catch {
        throw {
	    status: 500,
	    error: "Internal Server Error",
	    message: "An error has ocurred in the server. Please try again later."
        }
    }
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
