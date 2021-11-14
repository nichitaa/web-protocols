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
     * List the content of the FTP server path
     * @param req
     * @param res
     * @param next
     */
    public list(req: Request, res: Response, next: NextFunction) {
        this.client.list((err, list) => {
            try {
                if (err) throw err;
                return res.json({isSuccess: true, data: list});
            } catch (error) {
                res.json({isSuccess: false, error: error.message});
            }
        });
    }

    /**
     * Responses with the file stream of the requested FTP server path
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
     * Uploads the file from previously saved multer temporary location directly to the FTP server
     * @param req
     * @param res
     * @param next
     */
    public upload(req: Request, res: Response, next: NextFunction) {
        try {
            // path to temporary multer api storage
            const tempPath = path.resolve(__dirname, `../temp/${req.file?.originalname}`);
            this.client.put(fs.createReadStream(tempPath), req.file!.originalname, err => {
                if (err) throw err;
                // delete temporary file as it is already saved on our FTP server
                fs.unlinkSync(tempPath);
                res.send({
                    isSuccess: true,
                    message: `file: ${req.file?.originalname} successfully uploaded to FTP server!`
                });
            });
        } catch (error) {
            res.send({isSuccess: false, error: error.message});
        }
    }

}