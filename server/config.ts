import dotenv from "dotenv";

dotenv.config();

export const JWT_SECRET_KEY: string = process.env.JWT_SECRET_KEY;

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
