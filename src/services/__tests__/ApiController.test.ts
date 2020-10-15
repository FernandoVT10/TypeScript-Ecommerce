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

            expect(fetchMock).toBeCalledWith("http://localhost:3000/api/test");
        });

        it("should throw an error", async () => {
            fetchMock.mockRejectOnce(() => Promise.reject("Testing API"));

            let thrownError;

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
            expect(fetchMock).toBeCalledWith("http://localhost:3000/api/test");
        });
    });
});