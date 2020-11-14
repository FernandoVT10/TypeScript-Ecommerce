import nodemailer from "nodemailer";
import { MAIL_CONFIG } from "../../config";

const transporter = nodemailer.createTransport({
    host: MAIL_CONFIG.host,
    secure: true,
    port: MAIL_CONFIG.port,
    auth: {
	user: MAIL_CONFIG.username,
	pass: MAIL_CONFIG.password,
    }
});

export default transporter;
