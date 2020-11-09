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

	const recommendedProductsResponse = await ApiController.get<{
	    products: ProductProps["recommendedProducts"]
	}>(`products?limit=10`);

	const reviewsCountResonse = await ApiController.get<{
	    reviewsCount: ProductProps["reviewsCount"]
	}>(`products/${productId}/reviews/getTotalStarsCount/`);

        return {
            props: {
		product: productResponse.data.product,
		recommendedProducts: recommendedProductsResponse.data.products,
		reviewsCount: reviewsCountResonse.data.reviewsCount
            }
        }
    } catch {
	const { res } = context;

	res.statusCode = 302;
	res.setHeader("location", "/products#product_not_found");
	res.end();

	return { props: {} };
    }
}

function ProductPage({ product, recommendedProducts, reviewsCount }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    return (
        <div>
	    <Head>
		<title>{product.title} - TypeScript Ecommerce</title>
	    </Head>

	    <Product
	    product={product}
	    recommendedProducts={recommendedProducts}
	    reviewsCount={reviewsCount}/>
        </div>
    );
}

export default ProductPage;
