import FTPClient from '../../../../ftp/src/FTPClient';
import {NextFunction, Request, Response} from 'express';
import dotenv from 'dotenv';
import {SmtpService} from '../../services/SMTPService';
import {IResponseOptions} from '../../types';

dotenv.config();

export default class FtpController {

    private ftpClient: FTPClient;
    private smtpService: SmtpService;

    public constructor() {
        this.ftpClient = new FTPClient({
            host: (process.env.HOST_NAME as string),
            port: parseInt(process.env.FTP_PORT as string),
            user: (process.env.FTP_USERNAME as string),
            password: (process.env.FTP_PASSWORD as string)
        });
        this.smtpService = SmtpService.getInstance();
    }

    private successResponse = (opts: IResponseOptions) => {
        const {req, res, method, data, message, stream} = opts;

        if (!stream) res.status(200).json({isSuccess: true, message, data});
        else {
            res.setHeader('content-type', 'some/type');
            stream!.pipe(res);
        }

        this.smtpService.sendNotification({
            isSuccess: true, method: method, body: {message, data},
            FTPPath: (req.query.path as string)
        });
    };

    private errorResponse = (opts: IResponseOptions) => {
        const {req, res, method, data, message} = opts;
        res.status(400).json({isSuccess: false, error: message, data});
        this.smtpService.sendNotification({
            isSuccess: false, method: method, errorMessage: message,
            FTPPath: req.query.path ? (req.query.path as string) : 'No query param `path` was provided'
        });
    };

    // files
    public list = async (req: Request, res: Response, next: NextFunction) => {
        this.ftpClient.list((req.query.path as string))
            .then((info) => {
                this.successResponse({req, res, ...info});
            })
            .catch((err) => {
                this.errorResponse({req, res, ...err});
            });
    };

    public download = (req: Request, res: Response, next: NextFunction) => {
        this.ftpClient.download((req.query.path as string))
            .then((info) => {
                this.successResponse({req, res, ...info});
            })
            .catch((err) => {
                this.errorResponse({req, res, ...err});
            });
    };

    public upload = (req: Request, res: Response, next: NextFunction) => {
        this.ftpClient.upload((req.query.path as string), req.file!.originalname)
            .then((info) => {
                this.successResponse({req, res, ...info});
            })
            .catch((err) => {
                this.errorResponse({req, res, ...err});
            });
    };

    public delete = (req: Request, res: Response, next: NextFunction) => {
        this.ftpClient.delete((req.query.path as string))
            .then((info) => {
                this.successResponse({req, res, ...info});
            })
            .catch((err) => {
                this.errorResponse({req, res, ...err});
            });
    };

    // directories
    public mkdir = (req: Request, res: Response, next: NextFunction) => {
        this.ftpClient.mkdir((req.query.path as string))
            .then((info) => {
                this.successResponse({req, res, ...info});
            })
            .catch((err) => {
                this.errorResponse({req, res, ...err});
            });
    };

    public rmdir = (req: Request, res: Response, next: NextFunction) => {
        this.ftpClient.rmdir((req.query.path as string))
            .then((info) => {
                this.successResponse({req, res, ...info});
            })
            .catch((err) => {
                this.errorResponse({req, res, ...err});
            });
    };
}
