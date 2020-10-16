import app from "../../app";
import supertest from "supertest";
import Product, { IProduct } from "../../models/Product";

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
        createdAt: Date.now() + 30
    }
];

describe("Products API", () => {
    beforeEach(async () => {
        await Product.insertMany(PRODUCTS_MOCK);
    });

    describe("GET", () => {
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
    });
});