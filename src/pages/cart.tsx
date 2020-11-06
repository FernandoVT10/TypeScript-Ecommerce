import { InferGetServerSidePropsType } from "next";

import Head from "next/head";

import ShoppingCart, { ShoppingCartProps } from "@/domain/ShoppingCart";

import ApiController from "@/services/ApiController";

export async function getServerSideProps() {
    try {
	const products: ShoppingCartProps["products"] = [];

        return {
            props: {
		products
            }
        }
    } catch {
        return {
            props: {
		products: []
            }
        }
    }
}

function IndexPage({ products }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    return (
        <div>
            <Head>
                <title>TypeScript Ecommerce - Shopping Cart</title>
            </Head>

	    <ShoppingCart products={products}/>
        </div>
    );
}

export default IndexPage;
