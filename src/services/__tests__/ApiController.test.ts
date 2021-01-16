import ApiController, { fetchCall as apiFetchCall } from "../ApiController";

describe("Services Api Controller", () => {
    beforeEach(() => {
        fetchMock.resetMocks();

	window.localStorage.setItem("token", "testtoken")
	Object.defineProperty(process, "browser", {
	    value: true
	});
    });

    describe("Fetch Call", () => {
        it("should throw an error", async () => {
            fetchMock.mockRejectOnce(() => Promise.reject("Testing API"));

            try {
                await apiFetchCall<{ message: "Test Message" }>("/api/v2/test");
            } catch (error) {
		expect(error).toEqual({
		    status: 500,
		    error: "Internal Server Error",
		    message: "An error has ocurred in the server. Please try again later."
		});
            }

	    const fetchCall = fetchMock.mock.calls[0];

            expect(fetchCall[0]).toMatch("/api/v2/test");
        });
    });

    describe("Get method", () => {
        it("should get and parse the data correctly", async () => {
            fetchMock.mockResponseOnce(
                JSON.stringify({ message: "Test Message" })
            );

            const res = await ApiController.get<{ message: "Test Message" }>("test");

            expect(res.message).toBe("Test Message");

	    const fetchCall = fetchMock.mock.calls[0];

            expect(fetchCall[0]).toMatch("/api/test");
            expect(fetchCall[1].headers).toEqual({
		Authorization: "Bearer testtoken"
	    });
        });
    });

    describe("POST method", () => {
	it("should send and get the data correctly", async () => {
            fetchMock.mockResponseOnce(
                JSON.stringify({ message: "Post test message" })
            );

            const res = await ApiController.post<{ message: string }>("postTest", {
		body: {
		    test: "i'm a parameter :)"
		}
	    });

	    expect(res.message).toBe("Post test message");

	    const fetchCall = fetchMock.mock.calls[0];

	    expect(fetchCall[0]).toMatch("/api/postTest");

	    expect(fetchCall[1].body).toBe(JSON.stringify({
		test: "i'm a parameter :)"
	    }));
	    expect(fetchCall[1].method).toBe("POST");
	    expect(fetchCall[1].headers).toEqual({
		"Content-Type": "application/json",
		Authorization: "Bearer testtoken"
	    });
	});

        it("should send a formData correctly", async () => {
            fetchMock.mockResponseOnce(
                JSON.stringify({ message: "Post test message" })
            );

            const formData = new FormData;
            formData.append("test", "test value");

            await ApiController.post<{ message: string }>("postTest", {
		formData
	    });

	    const fetchCall = fetchMock.mock.calls[0];
	    expect(fetchCall[0]).toMatch("/api/postTest");

            const body = fetchCall[1].body as FormData;
	    expect(body.get("test")).toBe("test value");

	    expect(fetchCall[1].method).toBe("POST");
	    expect(fetchCall[1].headers).toEqual({
		Authorization: "Bearer testtoken"
	    });
        });
    });

    describe("PUT method", () => {
	it("should send and get the data correctly", async () => {
            fetchMock.mockResponseOnce(
                JSON.stringify({ message: "Put test message" })
            );

            const res = await ApiController.put<{ message: string }>("putTest", {
		body: {
		    test: "i'm a parameter :)"
		}
	    });

	    expect(res.message).toBe("Put test message");

	    const fetchCall = fetchMock.mock.calls[0];

	    expect(fetchCall[0]).toMatch("/api/putTest");

	    expect(fetchCall[1].body).toBe(JSON.stringify({
		test: "i'm a parameter :)"
	    }));
	    expect(fetchCall[1].method).toBe("PUT");
	    expect(fetchCall[1].headers).toEqual({
		"Content-Type": "application/json",
		Authorization: "Bearer testtoken"
	    });
	});

        it("should send a formData correctly", async () => {
            fetchMock.mockResponseOnce(
                JSON.stringify({ message: "Post test message" })
            );

            const formData = new FormData;
            formData.append("test", "test value");

            await ApiController.put<{ message: string }>("putTest", {
		formData
	    });

	    const fetchCall = fetchMock.mock.calls[0];
	    expect(fetchCall[0]).toMatch("/api/putTest");

            const body = fetchCall[1].body as FormData;
	    expect(body.get("test")).toBe("test value");

	    expect(fetchCall[1].method).toBe("PUT");
	    expect(fetchCall[1].headers).toEqual({
		Authorization: "Bearer testtoken"
	    });
        });
    });

    describe("DELETE method", () => {
	it("should call the api correctly", async () => {
            fetchMock.mockResponseOnce(
                JSON.stringify({ message: "Delete test message" })
            );

            const res = await ApiController.delete<{ message: string }>("to/delete/id");
	    expect(res.message).toBe("Delete test message");

	    const fetchCall = fetchMock.mock.calls[0];

	    expect(fetchCall[0]).toMatch("/api/to/delete/id");

	    expect(fetchCall[1].method).toBe("DELETE");
	    expect(fetchCall[1].headers).toEqual({
		"Content-Type": "application/json",
		Authorization: "Bearer testtoken"
	    });
	});
    });
});
