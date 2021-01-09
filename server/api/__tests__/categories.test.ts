import app from "../../app";
import supertest from "supertest";

import Category, { ICategory } from "../../models/Category";
import User from "../../models/User";

const request = supertest(app);

setupTestDB("test_categories_api");
mockAuthentication();

const CATEGORIES_MOCK = [
    { name: "Gamer Accesories" },
    { name: "Office Accesories" },
    { name: "Home Accesories" },
    { name: "Technology Accesories" }
];

describe("Categories API", () => {
    beforeEach(async () => {
        await Category.insertMany(CATEGORIES_MOCK);

	await User.updateOne({}, { permits: "ADMIN" });
    });

    describe("Get All Categories", () => {
        it("should get all categories", async () => {
            const res = await request.get("/api/categories");
            
            const categories: ICategory[] = res.body.data.categories;

            categories.forEach(({ name }, index) => {
                expect(name).toBe(CATEGORIES_MOCK[index].name);
            });
        });
    });

    describe("Create Categorry", () => {
	it("should create a category", async () => {
	    const res = await request.post("/api/categories/").send({
	    	name: "test"
	    }).set("Authorization", "Bearer token");

	    const { createdCategory } = res.body.data;
	    expect(createdCategory.name).toBe("test")
	    
	    expect(await Category.exists({ name: "test" })).toBeTruthy();
	});
    });

    describe("Delete Category", () => {
	let categoryId = "";

	beforeEach(async () => {
	    const category = await Category.create({ name: "created category" });
	    categoryId = category._id;
	});

	it("should delete a category", async () => {
	    const res = await request.delete(`/api/categories/${categoryId}`).set("Authorization", "Bearer token");

	    const { deletedCategory } = res.body.data;
	    expect(deletedCategory.name).toBe("created category")
	    
	    expect(await Category.exists({ _id: categoryId })).toBeFalsy();
	});

	it("should return an error when the category doesn't exist", async () => {
	    const res = await request.delete(`/api/categories/abcdefabcdefabcdefabcdef`).set("Authorization", "Bearer token");

	    expect(res.body).toEqual({
		status: 404,
		error: "Category not found",
		message: `The category 'abcdefabcdefabcdefabcdef' doesn't exist`,
		path: "/api/categories/abcdefabcdefabcdefabcdef"
	    });
	});
    });
});
