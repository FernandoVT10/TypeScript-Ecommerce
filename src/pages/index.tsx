import Head from "next/head";

import Navbar from "@/components/Navbar";

function IndexPage() {
    return (
        <div>
            <Head>
                <title>TypeScript Ecommerce - Home</title>
            </Head>
            
            <Navbar/>
        </div>
    );
}

export default IndexPage;