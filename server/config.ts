import dotenv from "dotenv";
import { join } from "path";

dotenv.config();

export const IMAGES_DIRECTORY = join(__dirname, "../public/img/");

export const JWT_SECRET_KEY: string = process.env.JWT_SECRET_KEY;

export const PAYPAL_CLIENT_ID: string = process.env.PAYPAL_CLIENT_ID;
export const PAYPAL_CLIENT_SECRET: string = process.env.PAYPAL_CLIENT_SECRET;

interface MailConfig {
    host: string,
    port: number,
    username: string,
    password: string
}

export const MAIL_CONFIG: MailConfig = {
    host: process.env.MAIL_HOST,
    port: parseInt(process.env.MAIL_PORT) || 465,
    username: process.env.MAIL_USERNAME,
    password: process.env.MAIL_PASSWORD
}
