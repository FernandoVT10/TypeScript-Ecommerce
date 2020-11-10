import { AddSpacesToNumber, getDiscountedPrice } from "../FormatsForNumber";

describe("Formats For Number Service", () => {
    describe("Add Spaces To Number", () => {
	it("shouldn't add spaces to 354", () => {
	    expect(AddSpacesToNumber(354)).toBe("354");
	});

	it("should add spaces to 1509708", () => {
	    expect(AddSpacesToNumber(1509708)).toBe("1 509 708");
	});

	it("should add spaces to 3092", () => {
	    expect(AddSpacesToNumber(3092)).toBe("3 092");
	});

	it("should remove the last 3 decimals to 1092.5912", () => {
	    expect(AddSpacesToNumber(1092.5912)).toBe("1 092.59");
	});
    });

    describe("Get Discounted Price", () => {
	it("should get the discounted price", () => {
	    expect(getDiscountedPrice(1000, 50)).toBe(500);
	});
    });
});
