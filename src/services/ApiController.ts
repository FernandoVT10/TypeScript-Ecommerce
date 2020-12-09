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

interface postOptions {
    body: object
}

export default {
    get<T>(url: string) {
	const authToken = process.browser ? window.localStorage.getItem("token") : "";

	const options = {
	    headers: {
		"Authorization": `Bearer ${authToken}`
	    }
	}

        return fetchCall<T>(API_URL + url, options);
    },
    post<T>(url: string, options: postOptions) {
	const authToken = process.browser ? window.localStorage.getItem("token") : "";

	const newOptions = {
	    body: JSON.stringify(options.body),
	    method: "POST",
	    headers: {
		"Content-Type": "application/json",
		"Authorization": `Bearer ${authToken}`
	    }
	}

	return fetchCall<T>(API_URL + url, newOptions);
    },
    put<T>(url: string, options: postOptions) {
	const authToken = window.localStorage.getItem("token");

	const newOptions = {
	    body: JSON.stringify(options.body),
	    method: "PUT",
	    headers: {
		"Content-Type": "application/json",
		"Authorization": `Bearer ${authToken}`
	    }
	}

	return fetchCall<T>(API_URL + url, newOptions);
    },
    delete<T>(url: string) {
	const authToken = window.localStorage.getItem("token");

	const options = {
	    method: "DELETE",
	    headers: {
		"Content-Type": "application/json",
		"Authorization": `Bearer ${authToken}`
	    }
	}

	return fetchCall<T>(API_URL + url, options);
    }
}
