import FtpController from '../controllers/ftp/ftp.controller';
import {DefaultController} from '../controllers';
import {DefaultRouter} from './default.router';
import {FtpRouter} from './ftp.router';
import {AppRouter} from '../types';

export const routes: AppRouter[] = [
    new DefaultRouter(new DefaultController()),
    new FtpRouter(new FtpController())
];