import ShoppingCartController from "../ShoppingCartController";

const CART_ITEMS_MOCK = [
    {
	productId: "id-1",
	quantity: 2
    },
    {
	productId: "id-2",
	quantity: 5
    },
    {
	productId: "id-3",
	quantity: 10
    }
];

describe("Shopping Cart Controller Service", () => {
    beforeEach(() => {
	window.localStorage.clear();

	window.localStorage.setItem("cart", JSON.stringify(CART_ITEMS_MOCK));
    });

    describe("Get Items Method", () => {
	it("should get and parse the shopping cart from localStorage", () => {
	    const cartItems = ShoppingCartController.getItems();

	    expect(cartItems).toHaveLength(3);
	    expect(cartItems).toEqual(CART_ITEMS_MOCK);
	});

	it("should get an empty array when the localStorage is empty", () => {
	    window.localStorage.clear();

	    const cartItems = ShoppingCartController.getItems();

	    expect(cartItems).toHaveLength(0);
	});
    });

    describe("Set Item Method", () => {
	it("should set an item", () => {
	    ShoppingCartController.setItem({
		productId: "set-item",
		quantity: 100
	    });

	    const cartItems = JSON.parse(window.localStorage.getItem("cart"));

	    expect(cartItems).toHaveLength(4);
	    expect(cartItems[3].productId).toBe("set-item");
	});

	it("should replace the quantity of an existing item", () => {
	    ShoppingCartController.setItem({
		productId: "set-item",
		quantity: 100
	    });

	    ShoppingCartController.setItem({
		productId: "set-item",
		quantity: 1000
	    });

	    const cartItems = JSON.parse(window.localStorage.getItem("cart"));

	    expect(cartItems).toHaveLength(4);
	    expect(cartItems[3].quantity).toBe(1000);
	});
    });

    describe("Update Item Method", () => {
	it("should update an item when it exists", () => {
	    ShoppingCartController.updateItem("id-1", 1000);

	    const cartItems = JSON.parse(window.localStorage.getItem("cart"));

	    expect(cartItems).toHaveLength(3);
	    expect(cartItems[0].quantity).toBe(1000);
	});

	it("shouldn't do anything when the item doesn't exists", () => {
	    ShoppingCartController.updateItem("random-id", 1000);

	    const cartItems = JSON.parse(window.localStorage.getItem("cart"));

	    expect(cartItems).toEqual(CART_ITEMS_MOCK);
	});
    });

    describe("Delete Item Method", () => {
	it("should delete an item", () => {
	    ShoppingCartController.deleteItem("id-2");

	    const cartItems = JSON.parse(window.localStorage.getItem("cart"));

	    expect(cartItems).toHaveLength(2);
	});
    });
});
