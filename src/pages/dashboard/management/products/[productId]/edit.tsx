import { InferGetServerSidePropsType, NextPageContext } from "next";

import Head from "next/head";

import EditProduct, { EditProductProps } from "@/domain/Dashboard/Management/Product/EditProduct";

import withAuth from "@/hoc/withAuth";

import ApiController from "@/services/ApiController";

interface ApiResponse {
    data: {
	product: EditProductProps["product"]
    }
}

export const getServerSideProps = async (ctx: NextPageContext) => {
    const { productId } = ctx.query;

    const res = await ApiController.get<ApiResponse>(`products/${productId}`);

    if(!res.data) {
	return { notFound: true }
    }

    return {
	props: {
	    product: res.data.product
	}
    }
}

const EditProductPage = ({ product }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    return (
	<div>
	    <Head>
	    	<title>Edit Product - TypeScript Ecommerce</title>
	    </Head>

	    <EditProduct product={product}/>
	</div>
    );
}

export default withAuth(EditProductPage, "ADMIN");
