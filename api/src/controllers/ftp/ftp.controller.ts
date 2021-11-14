import FTPClient from '../../../../ftp/src/FTPClient';
import {NextFunction, Request, Response} from 'express';
import dotenv from 'dotenv';

dotenv.config();

export default class FtpController {

    private ftpClient: FTPClient;

    public constructor() {
        this.ftpClient = new FTPClient({
            host: (process.env.HOST_NAME as string),
            port: parseInt(process.env.FTP_PORT as string),
            user: (process.env.FTP_USERNAME as string),
            password: (process.env.FTP_PASSWORD as string)
        });
    }

    public list(req: Request, res: Response, next: NextFunction) {
        this.ftpClient.list(req, res, next);
    }

    public download(req: Request, res: Response, next: NextFunction) {
        this.ftpClient.download(req, res, next);
    }

    public upload(req: Request, res: Response, next: NextFunction) {
        this.ftpClient.upload(req, res, next);
    }
}