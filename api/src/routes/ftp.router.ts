import {AppRouter} from './interfaces';
import {Router} from 'express';
import multer from 'multer';
import FtpController from '../controllers/ftp/ftp.controller';
import path from 'path';

export class FtpRouter implements AppRouter {
    private readonly router: Router;
    private upload;

    public constructor(private ftpController: FtpController) {
        this.router = Router();

        // configure multer temporary storage: see readme.md from `ftp/temp/`
        const storage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, path.resolve(__dirname, '../../../ftp/temp'));
            },
            filename: (req, file: Express.Multer.File, cb) => {
                cb(null, file.originalname);
            }

        });
        this.upload = multer({storage: storage});

        this.initRoutes();
    }

    initRoutes = (): void => {
        // files
        this.router.get('/ftp-api/download/:path(*)', this.ftpController.download);
        this.router.post('/ftp-api/upload/:path(*)', this.upload.single('file'), this.ftpController.upload);
        this.router.delete('/ftp-api/delete/:path(*)', this.ftpController.delete);
        this.router.get('/ftp-api/:path(*)', this.ftpController.list);
        // directories
        this.router.post('/ftp-api/mkdir/:path(*)', this.ftpController.mkdir);
        this.router.delete('/ftp-api/rmdir/:path(*)', this.ftpController.rmdir);
    };

    public get Router(): Router {
        return this.router;
    }
}