import Client from 'ftp';
import {NextFunction, Request, Response} from 'express';
import path from 'path';
import * as fs from 'fs';

export default class FTPClient {
    private client: Client;

    public constructor(clientOptions: Client.Options) {
        this.client = new Client();
        this.client.connect(clientOptions);
    }

    /**
     * List the content from the specified path on FTP server
     * @param req
     * @param res
     * @param next
     */
    public list(req: Request, res: Response, next: NextFunction) {
        this.client.list(req.params.path, (err, list) => {
            try {
                if (err) throw err;
                return res.json({isSuccess: true, data: list});
            } catch (error) {
                res.json({isSuccess: false, error: error.message});
            }
        });
    }

    /**
     * Responses with the file stream of the requested FTP server file for a specified path
     * @param req
     * @param res
     * @param next
     */
    public download(req: Request, res: Response, next: NextFunction) {
        console.log(`downloading from FTP server path: ${req.params.path}`);
        this.client.get(req.params.path, (err, stream) => {
            try {
                if (err) throw err;
                res.setHeader('content-type', 'some/type');
                stream.pipe(res);
            } catch (error) {
                res.send({isSuccess: false, error: error.message});
            }
        });
    }

    /**
     * Uploads the file from previously saved multer temporary location directly to a specified FTP server path
     * @param req
     * @param res
     * @param next
     */
    public upload(req: Request, res: Response, next: NextFunction) {
        // path to temporary multer api storage
        const tempPath = path.resolve(__dirname, `../temp/${req.file?.originalname}`);
        this.client.put(fs.createReadStream(tempPath), `${req.params.path}/${req.file!.originalname}`, err => {
            try {
                if (err) throw err;
                // delete temporary file as it is already saved on our FTP server
                fs.unlinkSync(tempPath);
                res.send({
                    isSuccess: true,
                    message: `file: ${req.file?.originalname} successfully uploaded to FTP server!`
                });
            } catch (error) {
                res.send({isSuccess: false, error: error.message});
            }
        });
    }

    /**
     * Deletes a file from the specified path
     * @param req
     * @param res
     * @param next
     */
    public delete(req: Request, res: Response, next: NextFunction) {
        this.client.delete(req.params.path, (err) => {
            try {
                if (err) throw err;
                res.send({
                    isSuccess: true,
                    message: `file: ${req.params.path} was successfully deleted!`
                });
            } catch (error) {
                res.send({isSuccess: false, error: error.message});
            }
        });
    }

    /**
     * Creates a directory
     * @param req
     * @param res
     * @param next
     */
    public mkdir(req: Request, res: Response, next: NextFunction) {
        this.client.mkdir(req.params.path, true, (err) => {
            try {
                if (err) throw err;
                res.send({
                    isSuccess: true,
                    message: `directory ${req.params.path} was successfully created!`
                });
            } catch (error) {
                res.send({isSuccess: false, error: error.message});
            }
        });

    }

    /**
     * Deletes a directory if empty
     * @param req
     * @param res
     * @param next
     */
    public rmdir(req: Request, res: Response, next: NextFunction) {
        this.client.rmdir(req.params.path, false, (err) => {
            try {
                if (err) throw err;
                res.send({
                    isSuccess: true,
                    message: `directory ${req.params.path} was successfully deleted!`
                });
            } catch (error) {
                res.send({isSuccess: false, error: error.message});
            }
        });
    }

}