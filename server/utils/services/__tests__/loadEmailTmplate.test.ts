import fs from "fs";

import { mocked } from "ts-jest/utils";

import loadEmailTemplate from "../loadEmailTemplate";

jest.mock("fs");

const mockedReadFile = mocked(fs.readFileSync);

describe("Load Email Template service", () => {
    beforeEach(() => {
	mockedReadFile.mockReset();
    });

    it("should return a template with its variables replaced", () => {
	const testTemplate = "This is a {variable} template called {variable2}. {variable2} is a {variable}";
	mockedReadFile.mockImplementation(() => testTemplate);

	const emailTemplate = loadEmailTemplate("test", { variable: "test", variable2: "mini musk" });

	expect(emailTemplate).toBe(
	    "This is a test template called mini musk. mini musk is a test"
	);

	const readFileCall = mockedReadFile.mock.calls[0];

	expect(readFileCall[0]).toMatch("/mails/test.html");
    });
});
