import { InferGetServerSidePropsType, GetServerSidePropsContext } from "next";

import Head from "next/head";

import Product, { ProductProps } from "@/domain/Product";

import ApiController from "@/services/ApiController";

export async function getServerSideProps(context: GetServerSidePropsContext)  {
    const { productId } = context.params;

    try {
	const productResponse = await ApiController.get<{
	    product: ProductProps["product"]
	}>(`products/${productId}`);

        return {
            props: {
                product: productResponse.data.product
            }
        }
    } catch {
        return {
            props: {
                product: null
            }
        }
    }
}

function ProductPage({ product }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    return (
        <div>
	    <Head>
		<title>{product.title} - TypeScript Ecommerce</title>
	    </Head>
	    <Product product={product}/>
        </div>
    );
}

export default ProductPage;
