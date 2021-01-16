import Head from "next/head";

import CreateProduct from "@/domain/Dashboard/Management/Product/CreateProduct";

import withAuth from "@/hoc/withAuth";

const CreatePage = () => {
    return (
        <div>
            <Head>
                <title>Create Product - TypeScript Ecommerce</title>
            </Head>

            <CreateProduct/>
        </div>
    );
}

export default withAuth(CreatePage, "ADMIN");
