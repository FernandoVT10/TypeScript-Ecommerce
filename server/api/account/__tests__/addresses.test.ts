import app from "../../../app";
import supertest from "supertest";

import Address from "../../../models/Address";
import User from "../../..//models/User";

const request = supertest(app);

setupTestDB("test_account_addresses_api");
mockAuthentication();

const ADDRESSES_MOCK = [
    {
	userId: "",
	fullName: "test 1",
	postalCode: "11111",
	state: "test state 1",
	municipality: "test municipality 1",
	suburb: "test suburb 1",
	street: "test street 1",
	outdoorNumber: "11",
	interiorNumber: "11",
	phoneNumber: "111-111-1111",
	additionalInformation: "test aditional information 1"
    },
    {
	userId: "",
	fullName: "test 2",
	postalCode: "22222",
	state: "test state 2",
	municipality: "test municipality 2",
	suburb: "test suburb 2",
	street: "test street 2",
	outdoorNumber: "22",
	interiorNumber: "22",
	phoneNumber: "222-222-2222",
	additionalInformation: "test aditional information 2"
    }
];

describe("Account Addresses API", () => {
    beforeEach(async () => {
	const user = await User.findOne();

	ADDRESSES_MOCK[0].userId = user._id;
	ADDRESSES_MOCK[1].userId = user._id;

	await Address.insertMany(ADDRESSES_MOCK);
    });

    describe("Get", () => {
	it("should get the addresses correctly", async () => {
	    const res = await request.get("/api/account/addresses/").set("Authorization", "Bearer token");

	    const { addresses } = res.body.data;

	    expect(addresses).toHaveLength(2);

	    expect(addresses[0].fullName).toBe("test 1");
	    expect(addresses[1].fullName).toBe("test 2");
	});
    });

    describe("Post / Create", () => {
	it("should create an addresses correctly", async () => {
	    const addressMock = {
	    	...ADDRESSES_MOCK[0],
		fullName: "created address"
	    }

	    const res = await request.post("/api/account/addresses/")
		.send(addressMock)
		.set("Authorization", "Bearer token");

	    const { createdAddress } = res.body.data;
	    expect(createdAddress.fullName).toBe("created address");

	    const existsAddress = await Address.exists({ _id: createdAddress._id });
	    expect(existsAddress).toBeTruthy();
	});

	it("should get a validation error", async () => {
	    const addressMock = {
	    	...ADDRESSES_MOCK[0],
		phoneNumber: "phone number"
	    }

	    const res = await request.post("/api/account/addresses/")
		.send(addressMock)
		.set("Authorization", "Bearer token");

	    const { status, error } = res.body;
	    expect(status).toBe(400);
	    expect(error).toBe("Validation Error");
	});
    });

    describe("Put / Update", () => {
	let addressId = "";

	beforeEach(async () => {
	    const address = await Address.findOne({ fullName: "test 1" });

	    addressId = address._id;
	});

	it("should create an addresses correctly", async () => {
	    const addressMock = {
	    	...ADDRESSES_MOCK[0],
		fullName: "updated address"
	    }

	    const res = await request.put(`/api/account/addresses/${addressId}`)
		.send(addressMock)
		.set("Authorization", "Bearer token");

	    const { updatedAddress } = res.body.data;
	    expect(updatedAddress.fullName).toBe("updated address");

	    const existsAddress = await Address.exists({ fullName: updatedAddress.fullName });
	    expect(existsAddress).toBeTruthy();
	});

	it("should get an address doesn't exists error", async () => {
	    const res = await request.put("/api/account/addresses/abcdefabcedfabcdefabcdef")
		.send({})
		.set("Authorization", "Bearer token");

	    const { status, error, message } = res.body;
	    expect(status).toBe(404);
	    expect(error).toBe("Address not found");
	    expect(message).toBe("The address abcdefabcedfabcdefabcdef doesn't exists");
	});

	it("should get a validation error", async () => {
	    const addressMock = {
	    	...ADDRESSES_MOCK[0],
		phoneNumber: "phone number"
	    }

	    const res = await request.put(`/api/account/addresses/${addressId}`)
		.send(addressMock)
		.set("Authorization", "Bearer token");

	    const { status, error } = res.body;
	    expect(status).toBe(400);
	    expect(error).toBe("Validation Error");
	});
    });

    describe("Delete", () => {
	it("should delete an address correctly", async () => {
	    const address = await Address.findOne({ fullName: "test 2" });

	    const res = await request.delete(`/api/account/addresses/${address._id}`)
		.set("Authorization", "Bearer token");

	    const { deletedAddress } = res.body.data;
	    expect(deletedAddress.fullName).toBe("test 2");

	    const exists = await Address.exists({ _id: deletedAddress._id });
	    expect(exists).toBeFalsy();
	});

	it("should get an address doesn't exists error", async () => {
	    const res = await request.delete(`/api/account/addresses/abcdefabcedfabcdefabcdef`)
		.set("Authorization", "Bearer token");

	    const { status, error, message } = res.body;
	    expect(status).toBe(404);
	    expect(error).toBe("Address not found");
	    expect(message).toBe("The address abcdefabcedfabcdefabcdef doesn't exists");
	});
    });
});
