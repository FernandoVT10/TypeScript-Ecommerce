import type { AppProps } from "next/app";

import Head from "next/head";

import withAlerts from "@/hoc/withAlerts";

import "@/styles/global.scss";

function App({ Component, pageProps }: AppProps) {
    return (
        <div>
            <Head>
                <link rel="shortcut icon" href="/favicon.png"/>

		<script src="https://kit.fontawesome.com/63ef8f1397.js" crossOrigin="anonymous"></script>
            </Head>

            <Component {...pageProps} />
        </div>
    );
}

export default withAlerts(App);
