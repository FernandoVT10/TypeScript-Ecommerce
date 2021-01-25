import Head from "next/head";

import Users from "@/domain/Dashboard/Management/Users";

import withAuth from "@/hoc/withAuth";

const UsersPage = () => {
    return (
        <div>
            <Head>
                <title>Users Management - TypeScript Ecommerce</title>
            </Head>

            <Users/>
        </div>
    );
}

export default withAuth(UsersPage, "SUPERADMIN");
