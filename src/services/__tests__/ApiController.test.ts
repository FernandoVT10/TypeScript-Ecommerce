import ApiController from "../ApiController";

describe("Services Api Controller", () => {
    beforeEach(() => {
        fetchMock.resetMocks();
    });

    describe("Get method", () => {
        it("should get and parse the data correctly", async () => {
            fetchMock.mockResponseOnce(
                JSON.stringify({ data: { message: "Test Message" } })
            );

            const res = await ApiController.get<{ message: "Test Message" }>("test");

            expect(res.data.message).toBe("Test Message");

	    const fetchCall = fetchMock.mock.calls[0];

            expect(fetchCall[0]).toMatch("/api/test");
        });

        it("should throw an error", async () => {
            fetchMock.mockRejectOnce(() => Promise.reject("Testing API"));

            let thrownError: Error;

            try {
                await ApiController.get<{ message: "Test Message" }>("test")
            } catch (error) {
                thrownError = error;
            }

            expect(thrownError).toEqual({
                errors: [
                    {
                        status: 500,
                        message: "An error has ocurred in the server. Please try again later."
                    }
                ]
            });

	    const fetchCall = fetchMock.mock.calls[0];

            expect(fetchCall[0]).toMatch("/api/test");
        });
    });

    describe("POST method", () => {
	it("should send and get the data correctly", async () => {
            fetchMock.mockResponseOnce(
                JSON.stringify({ data: { message: "Post test message" } })
            );

            const res = await ApiController.post<{ message: "Post test message" }>("postTest", {
		body: {
		    test: "i'm a parameter :)"
		}
	    });

	    expect(res.data.message).toBe("Post test message");

	    const fetchCall = fetchMock.mock.calls[0];

	    expect(fetchCall[0]).toMatch("/api/postTest");

	    expect(fetchCall[1].body).toBe(JSON.stringify({
		test: "i'm a parameter :)"
	    }));
	    expect(fetchCall[1].method).toBe("POST");
	    expect(fetchCall[1].headers).toEqual({
		"Content-Type": "application/json"
	    });
	});
    });
});
