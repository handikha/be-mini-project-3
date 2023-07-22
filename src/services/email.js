import config from "../config/mail";

const transport = createTransport(config);

export function sendEmail(from, to, subject, html) {
    return transport.sendMail({from, subject, to, html});
}
