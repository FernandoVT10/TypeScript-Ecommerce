import app from "../../app";
import supertest from "supertest";
import Product, { IProduct } from "../../models/Product";
import Category from "../../models/Category";
import { IPagination } from "../../utils/paginate";

const request = supertest(app);

setupTestDB("test_products_api");

const PRODUCTS_MOCK = [
    {
        title: "test title",
        images: ["test-1.jpg"],
        price: 25,
        inStock: 2,
        arrivesIn: "1 day",
        warranty: "6 months",
        description: "test description",
        categories: [],
        createdAt: Date.now()
    },
    {
        title: "test title 2",
        images: ["test-2.jpg"],
        price: 50,
        inStock: 3,
        arrivesIn: "3 day",
        warranty: "3 years",
        description: "test description 2",
        categories: [],
        createdAt: Date.now() + 100
    },
    {
        title: "product with discount",
        images: ["discount-1.jpg"],
        price: 25,
        discount: 10,
        inStock: 2,
        arrivesIn: "2 day",
        warranty: "3 months",
        description: "test description",
        categories: [],
        createdAt: Date.now() + 5
    },
    {
        title: "product with discount 2",
        images: ["discount-2.jpg"],
        price: 50,
        discount: 25,
        inStock: 3,
        arrivesIn: "3 day",
        warranty: "3 years",
        description: "test description 2",
        categories: [],
        createdAt: Date.now() + 30
    }
];

const CATEGORIES_MOCK = [
    { name: "Gamer Accesories" },
    { name: "Office Accesories" },
    { name: "Home Accesories" },
    { name: "Technology Accesories" }
];

describe("Products API", () => {
    beforeEach(async () => {
        const categories = await Category.insertMany(CATEGORIES_MOCK);

        PRODUCTS_MOCK[1].categories = [categories[0], categories[1]];

        await Product.insertMany(PRODUCTS_MOCK);
    });

    describe("GET", () => {
        it("should get the pagination correctly", async () => {
            const res = await request.get("/api/products?limit=1");

            const pagination: IPagination = res.body.data.pagination;

            expect(pagination.pages.length).toBe(4);
            expect(pagination.hasNextPage).toBe(true);
            expect(pagination.nextPage).toBe(2);
            expect(pagination.hasPrevPage).toBe(false);
        });

        it("should get 3 product only", async () => {
            const res = await request.get("/api/products?limit=3");

            const products: IProduct[] = res.body.data.products;

            expect(products[1].title).toBe("product with discount 2");
            expect(products[1].images).toEqual(["discount-2.jpg"]);

            expect(products[2].title).toBe("product with discount");
            expect(products[2].images).toEqual(["discount-1.jpg"]);

            expect(products.length).toBe(3);
        });

        it("should get discounted products only", async () => {
            const res = await request.get("/api/products?discountsOnly=true");

            const products: IProduct[] = res.body.data.products;

            expect(products[0].title).toBe("product with discount 2");
            expect(products[0].images).toEqual(["discount-2.jpg"]);

            expect(products[1].title).toBe("product with discount");
            expect(products[1].images).toEqual(["discount-1.jpg"]);

            expect(products.length).toBe(2);
        });

        it("should get a discounted product", async () => {
            const res = await request.get("/api/products?limit=1&discountsOnly=true");

            const products: IProduct[] = res.body.data.products;

            expect(products[0].title).toBe("product with discount 2");
            expect(products[0].images).toEqual(["discount-2.jpg"]);

            expect(products.length).toBe(1);
        });

        it("should get 2 products with a search", async () => {
            const res = await request.get("/api/products?search=test title");

            const products: IProduct[] = res.body.data.products;

            expect(products[0].title).toBe("test title 2");

            expect(products[1].title).toBe("test title");

            expect(products.length).toBe(2);
        });

        it("should get a product with a category", async () => {
            const res = await request.get("/api/products?category=Gamer Accesories");

            const products: IProduct[] = res.body.data.products;

            expect(products[0].title).toBe("test title 2");

            expect(products.length).toBe(1);
        });

        it("should get the third product with page option", async () => {
            const res = await request.get("/api/products?limit=1&page=3");

            const products: IProduct[] = res.body.data.products;

            expect(products[0].title).toBe("product with discount");
        });
    });
});