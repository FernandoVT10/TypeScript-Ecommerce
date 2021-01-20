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

    describe("Image", () => {
        it("should return false when it's not an image", () => {
            expect(validate.image("file/text")).toBeFalsy();
        });

        it("should return true when it's an image", () => {
            expect(validate.image("image/webp")).toBeTruthy();
        });
    });
});
