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
    setItem,
    updateItem,
    deleteItem,
    clear
}
