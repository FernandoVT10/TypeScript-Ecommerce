import readFileAsDataURL from "../readFileAsDataURL";

const FILE_MOCK = new File([], "test.jpg", {
    type: "image/jpeg"
});

const fileReader = jest.spyOn(window, "FileReader");

const readAsDataURLMock = jest.fn();

describe("@/services/readFileAsDataURL", () => {
    beforeEach(() => {
        jest.resetAllMocks();
        fileReader.mockImplementation(() => ({
            result: "data",
            addEventListener: (_, cb) => cb(),
            readAsDataURL: readAsDataURLMock
        } as any));
    });

    it("should return the file data correctly", async () => {
        expect(await readFileAsDataURL(FILE_MOCK)).toBe("data");

        expect(readAsDataURLMock).toHaveBeenCalledWith(FILE_MOCK);
    });
});
