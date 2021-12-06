import {FTPMethods} from '../../../ftp/types';
import {Request, Response, Router} from 'express';


export interface AppRouter {
    Router: Router
}

export interface IResponseOptions {
    req: Request;
    res: Response;
    method: FTPMethods;
    stream?: NodeJS.ReadableStream,
    data?: any[];
    message?: string;
}

export interface ISmtpNotificationConf {
    method: FTPMethods,
    body?: any,
    FTPPath: string,
    isSuccess: boolean,
    errorMessage?: string
}