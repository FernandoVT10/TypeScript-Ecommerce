import React from "react";

import Head from "next/head";

import withAuth from "@/hoc/withAuth";

import EditProfile from "@/domain/Dashboard/EditProfile";

const EditPage = () => {
    return (
	<div>
	    <Head>
		<title>Edit Profile - TypeScript Ecommerce</title>
	    </Head>

	    <EditProfile/>
	</div>
    );
}

export default withAuth(EditPage);
