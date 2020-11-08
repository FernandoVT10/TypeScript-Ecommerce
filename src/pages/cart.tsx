import Head from "next/head";

import ShoppingCart from "@/domain/ShoppingCart";

function Cart() {
    return (
        <div>
            <Head>
                <title>TypeScript Ecommerce - Shopping Cart</title>
            </Head>

	    <ShoppingCart/>
        </div>
    );
}

export default Cart;
