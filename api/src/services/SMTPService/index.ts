import {createTransport, Transporter} from 'nodemailer';
import {ISmtpNotificationConf} from '../../types';
import dotenv from 'dotenv';

dotenv.config();

export class SmtpService {
    private transporter: Transporter;
    private static _instance: SmtpService;

    private constructor() {
        this.transporter = createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT!),
            auth: {
                user: process.env.SMTP_AUTH_USER,
                pass: process.env.SMTP_AUTH_PASS
            }
        });
    }

    public static getInstance(): SmtpService {
        if (!SmtpService._instance) {
            SmtpService._instance = new SmtpService();
        }
        return SmtpService._instance;
    }

    public sendNotification = (config: ISmtpNotificationConf) => {
        this.transporter.sendMail({
            from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_AUTH_USER}>"`,
            to: process.env.SMTP_TO_ADDRESS,
            subject: 'FTP - API Notification 📃',
            html: `
            <div>
                <h1>FTP REST API Notification</h1>
                <b>METHOD: ${config.method}</b>
                <br>
                <b style="color: ${config.isSuccess ? 'green' : 'red'}">STATUS: ${config.isSuccess ? 'SUCCESS' : 'ERROR'}</b>
                <br>
                <b>JSON object with additional details below</b>
                <br>
                <pre>${JSON.stringify(config, undefined, 2)}</pre>
            </div>`
        }).then(info => {
            console.log(info.messageId);
        }).catch(err => {
            console.error('Error on sending email: ', err.message);
        });
    };
}