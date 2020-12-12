import validate from "../validate";

describe("Validate Service", () => {
    describe("Email", () => {
	it("should return false when the email is invalid", () => {
	    expect(validate.email("test@sdfs")).toBeFalsy();
	});

	it("should return true when the email is valid", () => {
	    expect(validate.email("test@examole.io")).toBeTruthy();
	});
    });
});
