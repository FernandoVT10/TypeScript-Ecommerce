import { InferGetServerSidePropsType, GetServerSidePropsContext } from "next";

import Head from "next/head";

import ApiController from "@/services/ApiController";

import Products, { ProductsProps } from "@/domain/Products";

interface APIResponses {
    products: {
	data: ProductsProps["productsResponse"]
    },
    categories: {
	data: {
            categories: ProductsProps["categories"]
	}
    }
}

export async function getServerSideProps(context: GetServerSidePropsContext)  {
    const search = context.query.search || "";
    const category = context.query.category || "";
    const page = context.query.page || "";

    try {
        const productsResponse = await ApiController.get<
	    APIResponses["products"]
        >(`products?search=${search}&category=${category}&page=${page}`);

	const categoriesResponse = await ApiController.get<
	    APIResponses["categories"]
	>("categories");

        return {
            props: {
                productsResponse: productsResponse.data,
                categories: categoriesResponse.data.categories
            }
        }
    } catch {
        const productsResponse: ProductsProps["productsResponse"] = {
            hasPrevPage: false,
            prevPage: null,
            hasNextPage: false,
            nextPage: null,
            page: 0,
            totalPages: 0,
            totalProducts: 0,
            products: []
        }
        
        return {
            props: {
                productsResponse,
                categories: []
            }
        }
    }
}

function ProductsPage({
    productsResponse,
    categories
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    return (
        <div>
            <Head>
                <title>TypeScript Ecommerce - Products</title>
            </Head>

            <Products
            productsResponse={productsResponse}
            categories={categories}/>
        </div>
    );
}

export default ProductsPage;
