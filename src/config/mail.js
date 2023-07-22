import dotenv from 'dotenv';

dotenv.config();

export const host = process.env.EMAIL_HOST;
export const port = process.env.EMAIL_PORT;
export const auth = {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
};

export default {
    host,
    port,
    auth
}