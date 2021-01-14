const API_URL = "http://localhost:3000/api/";

export async function fetchCall<T>(url: string, options = {}): Promise<T> {
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
    body?: object,
    formData?: FormData
}

const sendData = <T>(url: string, method: string, options: postOptions) => {
    const authToken = window.localStorage.getItem("token");

    const body = options.formData ? options.formData : options.body;

    const headers = {
        "Authorization": `Bearer ${authToken}`
    }

    if(options.body) {
        Object.assign(headers, { "Content-Type": "application/json" });
    }

    const newOptions = {
        body,
        method,
        headers
    }

    return fetchCall<T>(API_URL + url, newOptions);
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
        return sendData<T>(url, "POST", options);
    },
    put<T>(url: string, options: postOptions) {
        return sendData<T>(url, "PUT", options);
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
