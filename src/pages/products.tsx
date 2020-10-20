import { InferGetServerSidePropsType, GetServerSidePropsContext } from "next";

import Head from "next/head";

import ApiController from "@/services/ApiController";

import { ProductCardProps } from "@/components/ProductCard";
import { PaginationProps } from "@/components/Pagination";

import Products from "@/domain/Products";
import { Category } from "@/domain/Products/SearchDetails";

export async function getServerSideProps(context: GetServerSidePropsContext)  {
    const search = context.query.search ? context.query.search.toString() : "";
    const category = context.query.category ? context.query.category.toString() : "";
    const page = context.query.page ? context.query.page.toString() : "";

    try {
        const productsResponse = await ApiController.get<{
            products: ProductCardProps[],
            totalResults: number,
            pagination: PaginationProps
        }>(`products?search=${search}&category=${category}&page=${page}`);

        const categoriesResponse = await ApiController.get<{
            categories: Category[]
        }>("categories");

        return {
            props: {
                products: productsResponse.data.products,
                totalResults: productsResponse.data.totalResults,
                pagination: productsResponse.data.pagination,
                categories: categoriesResponse.data.categories
            }
        }
    } catch {
        return {
            props: {
                products: [],
                totalResults: 0,
                categories: []
            }
        }
    }
}

function ProductsPage({
    products,
    totalResults,
    pagination,
    categories
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
    return (
        <div>
            <Head>
                <title>TypeScript Ecommerce - Products</title>
            </Head>

            <Products
            products={products}
            totalResults={totalResults}
            pagination={pagination}
            categories={categories}/>
        </div>
    );
}

export default ProductsPage;