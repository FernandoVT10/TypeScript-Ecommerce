import app from "../../app";
import supertest from "supertest";
import Category, { ICategory } from "../../models/Category";

const request = supertest(app);

setupTestDB("test_categories_api");

const CATEGORIES_MOCK = [
    { name: "Gamer Accesories" },
    { name: "Office Accesories" },
    { name: "Home Accesories" },
    { name: "Technology Accesories" }
];

describe("Categories API", () => {
    beforeEach(async () => {
        await Category.insertMany(CATEGORIES_MOCK);
    });

    describe("GET", () => {
        it("should get all categories", async () => {
            const res = await request.get("/api/categories");
            
            const categories: ICategory[] = res.body.data.categories;

            categories.forEach(({ name }, index) => {
                expect(name).toBe(CATEGORIES_MOCK[index].name);
            });
        });
    });
});