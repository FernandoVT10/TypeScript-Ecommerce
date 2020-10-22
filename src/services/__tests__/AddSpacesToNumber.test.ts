import AddSpacesToNumber from "../AddSpacesToNumber";

describe("Services Number With Spaces", () => {
    it("shouldn't add spaces to 354", () => {
        expect(AddSpacesToNumber(354)).toBe("354");
    });

    it("should add spaces to 1509708", () => {
        expect(AddSpacesToNumber(1509708)).toBe("1 509 708");
    });

    it("should add spaces to 3092", () => {
        expect(AddSpacesToNumber(3092)).toBe("3 092");
    });
});