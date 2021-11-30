import Client from 'ftp';
import {NextFunction, Request, Response} from 'express';
import path from 'path';
import * as fs from 'fs';

interface IErrorResponseOptions {
    res: Response,
    statusCode: number,
    errorMessage?: string,
    invalidQueryParams?: boolean
}

export default class FTPClient {
    private client: Client;

    public constructor(clientOptions: Client.Options) {
        this.client = new Client();
        this.client.connect(clientOptions);
    }

    public errorRespnse = (opts: IErrorResponseOptions) => {
        const {res, statusCode, errorMessage, invalidQueryParams} = opts;
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
                    return res.json({isSuccess: true, data: list});
                } catch (error) {
                    this.errorRespnse({res, statusCode: 500, errorMessage: error.message});
                }
            });
        } else {
            this.errorRespnse({res, statusCode: 400, invalidQueryParams: true});
        }
    }

    /**
     * Responses with the file stream of the requested FTP server file for a specified path
     * @param req
     * @param res
     * @param next
     */
    public download = (req: Request, res: Response, next: NextFunction) => {
        console.log(`downloading from FTP server path: ${req.params.path}`);
        if (req.query.path) {
            this.client.get((req.query.path as string), (err, stream) => {
                try {
                    if (err) throw err;
                    res.setHeader('content-type', 'some/type');
                    stream.pipe(res);
                } catch (error) {
                    this.errorRespnse({res, statusCode: 500, errorMessage: error.message});
                }
            });
        } else {
            this.errorRespnse({res, statusCode: 400, invalidQueryParams: true});
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
                    res.send({
                        isSuccess: true,
                        message: `file: ${req.file?.originalname} successfully uploaded to FTP server!`
                    });
                } catch (error) {
                    this.errorRespnse({res, statusCode: 500, errorMessage: error.message});
                }
            });
        } else {
            this.errorRespnse({res, statusCode: 400, invalidQueryParams: true});
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
                    res.send({
                        isSuccess: true,
                        message: `file: ${req.params.path} was successfully deleted!`
                    });
                } catch (error) {
                    this.errorRespnse({res, statusCode: 500, errorMessage: error.message});
                }
            });
        } else {
            this.errorRespnse({res, statusCode: 400, invalidQueryParams: true});
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
                    res.send({
                        isSuccess: true,
                        message: `directory ${req.params.path} was successfully created!`
                    });
                } catch (error) {
                    this.errorRespnse({res, statusCode: 500, errorMessage: error.message});
                }
            });
        } else {
            this.errorRespnse({res, statusCode: 400, invalidQueryParams: true});
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
                    res.send({
                        isSuccess: true,
                        message: `directory ${req.params.path} was successfully deleted!`
                    });
                } catch (error) {
                    this.errorRespnse({res, statusCode: 500, errorMessage: error.message});
                }
            });
        } else {
            this.errorRespnse({res, statusCode: 400, invalidQueryParams: true});
        }
    }

}