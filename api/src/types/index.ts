import {FTPMethods} from '../../../ftp/types';
import {Router} from 'express';


export interface AppRouter {
    Router: Router
}

export interface ISmtpNotificationConf {
    method: FTPMethods,
    body?: any,
    FTPPath: string,
    isSuccess: boolean,
    errorMessage?: string
}