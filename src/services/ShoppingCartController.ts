import ApiController from "./ApiController";

export interface CartItem {
    productId: string,
    quantity: number
}

function getItems(): CartItem[] {
    if(window.localStorage.getItem("cart")) {
	const cartItems: CartItem[] = JSON.parse(window.localStorage.getItem("cart")) || [];

	return cartItems;
    }

    return [];
}

async function getProductsFromServer<T>() {
    const items = getItems();

    const products: T[] = [];

    for(const item of items) {
        try {
            const productResponse = await ApiController.get<{
                data: {
                    product: T & { quantity: number }
                } 
            }>(`products/${item.productId}`);

            const { product } = productResponse.data;

            product.quantity = item.quantity;

            products.push(product);   
        } catch {}
    }

    return products;
}

function setItem(newItem: CartItem): void {
    const items = getItems();

    let itemIndex: number = null;

    items.forEach((item, index) => {
	if(item.productId === newItem.productId) {
	    itemIndex = index;
	}
    });

    // if the productId exists in the shopping cart
    if(itemIndex !== null) {
	items[itemIndex].quantity = newItem.quantity;
    } else {
	items.push(newItem);
    }

    window.localStorage.setItem("cart", JSON.stringify(items));
}

function updateItem(productId: CartItem["productId"], quantity: CartItem["quantity"]) {
    const items = getItems();

    const updatedItems = items.map(item => {
	if(item.productId === productId) {
	    item.quantity = quantity;
	}

	return item;
    });

    window.localStorage.setItem("cart", JSON.stringify(updatedItems));
}

function deleteItem(productId: string): void {
   const items = getItems();

   const newItems = items.filter(item => item.productId !== productId);

   window.localStorage.setItem("cart", JSON.stringify(newItems));
}

function clear() {
    window.localStorage.setItem("cart", JSON.stringify([]));
}

export default {
    getItems,
    getProductsFromServer,
    setItem,
    updateItem,
    deleteItem,
    clear
}
