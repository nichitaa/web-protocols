import {DefaultRouter} from './default.router';
import {DefaultController} from '../controllers';
import {FtpRouter} from './ftp.router';
import FtpController from '../controllers/ftp/ftp.controller';

export const routes = [
    new DefaultRouter(new DefaultController()),
    new FtpRouter(new FtpController())
]