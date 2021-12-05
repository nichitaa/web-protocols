import {FTPMethods, IErrorOptions, ISuccessOptions} from '../types';
import {SmtpService} from '../../api/src/services/SMTPService';
import {NextFunction, Request, Response} from 'express';
import Client from 'ftp';
import path from 'path';
import * as fs from 'fs';


export default class FTPClient {
    private client: Client;
    private smtpService: SmtpService;

    public constructor(clientOptions: Client.Options) {
        this.client = new Client();
        this.smtpService = SmtpService.getInstance();
        this.client.connect(clientOptions);
    }

    public successResponse = (opts: ISuccessOptions) => {
        const {req, res, statusCode, message, data, method, stream} = opts;
        const response: any = {};
        if (stream) {
            res.setHeader('content-type', 'some/type');
            stream.pipe(res);
        } else {
            if (data) {
                response.data = data;
            }
            response.message = message;
            response.isSuccess = true;
            res.status(statusCode).json(response);
        }
        this.smtpService.sendNotification({
            isSuccess: true,
            FTPPath: (req.query.path as string),
            body: {message, data},
            method
        });
    };

    public errorResponse = (opts: IErrorOptions) => {
        const {res, req, method, statusCode, errorMessage, invalidQueryParams} = opts;
        this.smtpService.sendNotification({
            isSuccess: false,
            FTPPath: req.query.path ? (req.query.path as string) : 'No query param `path`',
            method,
            errorMessage: invalidQueryParams ? 'No query param `path` was provided!' : errorMessage!
        });
        res.status(statusCode).json({
            isSuccess: false,
            error: invalidQueryParams ? 'please provide the required query params' : errorMessage
        });
    };

    /**
     * List the content from the specified path on FTP server
     * @param req
     * @param res
     * @param next
     */
    public list(req: Request, res: Response, next: NextFunction) {
        if (req.query.path) {
            this.client.list((req.query.path as string), (err, list) => {
                try {
                    if (err) throw err;
                    this.successResponse({
                        req, res, statusCode: 200, data: list,
                        message: `results of LIST command in directory: ${(req.query.path)}`,
                        method: FTPMethods.LIST
                    });
                } catch (error) {
                    this.errorResponse({
                        req, res, statusCode: 500,
                        method: FTPMethods.LIST,
                        errorMessage: error.message
                    });
                }
            });
        } else {
            this.errorResponse({req, res, method: FTPMethods.LIST, statusCode: 400, invalidQueryParams: true});
        }
    }

    /**
     * Responses with the file stream of the requested FTP server file for a specified path
     * @param req
     * @param res
     * @param next
     */
    public download = (req: Request, res: Response, next: NextFunction) => {
        console.log(`downloading from FTP server path: ${req.query.path}`);
        if (req.query.path) {
            this.client.get((req.query.path as string), (err, stream) => {
                try {
                    if (err) throw err;
                    this.successResponse({
                        req, res, stream, statusCode: 200,
                        message: `Successfully downloaded file from ${req.query.path}`,
                        method: FTPMethods.DOWNLOAD
                    });
                    res.setHeader('content-type', 'some/type');
                    stream.pipe(res);
                } catch (error) {
                    this.errorResponse({
                        req, res, statusCode: 500,
                        method: FTPMethods.DOWNLOAD,
                        errorMessage: error.message
                    });
                }
            });
        } else {
            this.errorResponse({req, res, method: FTPMethods.DOWNLOAD, statusCode: 400, invalidQueryParams: true});
        }
    };

    /**
     * Uploads the file from previously saved multer temporary location directly to a specified FTP server path
     * @param req
     * @param res
     * @param next
     */
    public upload(req: Request, res: Response, next: NextFunction) {
        // path to temporary multer api storage
        const tempPath = path.resolve(__dirname, `../temp/${req.file?.originalname}`);
        if (req.query.path) {
            this.client.put(fs.createReadStream(tempPath), `${req.query.path}/${req.file!.originalname}`, err => {
                try {
                    if (err) throw err;
                    // delete temporary file as it is already saved on our FTP server
                    fs.unlinkSync(tempPath);
                    this.successResponse({
                        req, res, statusCode: 200,
                        message: `file: ${req.file?.originalname} successfully uploaded to path: ${req.query.path}/${req.file!.originalname}!`,
                        method: FTPMethods.UPLOAD
                    });
                } catch (error) {
                    this.errorResponse({
                        req, res, statusCode: 500,
                        method: FTPMethods.UPLOAD,
                        errorMessage: error.message
                    });
                }
            });
        } else {
            this.errorResponse({req, res, method: FTPMethods.UPLOAD, statusCode: 400, invalidQueryParams: true});
        }
    }

    /**
     * Deletes a file from the specified path
     * @param req
     * @param res
     * @param next
     */
    public delete(req: Request, res: Response, next: NextFunction) {
        if (req.query.path) {
            this.client.delete((req.query.path as string), (err) => {
                try {
                    if (err) throw err;
                    this.successResponse({
                        req, res, statusCode: 200,
                        message: `file: ${req.params.path} was successfully deleted!`,
                        method: FTPMethods.DELETE
                    });
                } catch (error) {
                    this.errorResponse({
                        req, res, statusCode: 500,
                        method: FTPMethods.DELETE,
                        errorMessage: error.message
                    });
                }
            });
        } else {
            this.errorResponse({req, res, method: FTPMethods.DELETE, statusCode: 400, invalidQueryParams: true});
        }
    }

    /**
     * Creates a directory
     * @param req
     * @param res
     * @param next
     */
    public mkdir(req: Request, res: Response, next: NextFunction) {
        if (req.query.path) {
            this.client.mkdir((req.query.path as string), true, (err) => {
                try {
                    if (err) throw err;
                    this.successResponse({
                        req, res, statusCode: 200,
                        message: `directory ${req.params.path} was successfully created!`,
                        method: FTPMethods.MKDIR
                    });
                } catch (error) {
                    this.errorResponse({
                        req, res, statusCode: 500,
                        method: FTPMethods.MKDIR,
                        errorMessage: error.message
                    });
                }
            });
        } else {
            this.errorResponse({req, res, method: FTPMethods.MKDIR, statusCode: 400, invalidQueryParams: true});
        }
    }

    /**
     * Deletes a directory if empty
     * @param req
     * @param res
     * @param next
     */
    public rmdir(req: Request, res: Response, next: NextFunction) {
        if (req.query.path) {
            this.client.rmdir((req.query.path as string), false, (err) => {
                try {
                    if (err) throw err;
                    this.successResponse({
                        req, res, statusCode: 200,
                        message: `directory ${req.params.path} was successfully deleted!`,
                        method: FTPMethods.RMDIR
                    });
                } catch (error) {
                    this.errorResponse({
                        req, res, statusCode: 500,
                        method: FTPMethods.RMDIR,
                        errorMessage: error.message
                    });
                }
            });
        } else {
            this.errorResponse({req, res, method: FTPMethods.RMDIR, statusCode: 400, invalidQueryParams: true});
        }
    }

}