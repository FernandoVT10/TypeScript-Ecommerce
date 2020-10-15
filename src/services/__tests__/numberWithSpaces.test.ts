import numberWithSpaces from "../numberWithSpaces";

describe("Services Number With Spaces", () => {
    it("shouldn't add spaces to 354", () => {
        expect(numberWithSpaces(354)).toBe("354");
    });

    it("should add spaces to 1509708", () => {
        expect(numberWithSpaces(1509708)).toBe("1 509 708");
    });

    it("should add spaces to 3092", () => {
        expect(numberWithSpaces(3092)).toBe("3 092");
    });
});