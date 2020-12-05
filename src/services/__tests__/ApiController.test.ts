import ApiController from "../ApiController";

describe("Services Api Controller", () => {
    beforeEach(() => {
        fetchMock.resetMocks();

	window.localStorage.setItem("token", "testtoken")
	Object.defineProperty(process, "browser", {
	    value: true
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

        it("should throw an error", async () => {
            fetchMock.mockRejectOnce(() => Promise.reject("Testing API"));

            try {
                await ApiController.get<{ message: "Test Message" }>("test")
            } catch (error) {
		expect(error).toEqual({
		    status: 500,
		    error: "Internal Server Error",
		    message: "An error has ocurred in the server. Please try again later."
		});
            }

	    const fetchCall = fetchMock.mock.calls[0];

            expect(fetchCall[0]).toMatch("/api/test");
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
