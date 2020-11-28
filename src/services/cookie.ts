import { GetServerSidePropsContext } from "next";

export const getTokenFromCookies = (req: GetServerSidePropsContext["req"]) => {
    if(!req.headers.cookie) return undefined;

    const cookie = req.headers.cookie;

    const token = cookie.split("token=")[1];

    if(!token) return undefined;

    return token.replace(";", "");
}
