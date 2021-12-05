import {Request, Response} from 'express';

export enum FTPMethods {
    LIST = 'LIST',
    DOWNLOAD = 'DOWNLOAD - GET',
    UPLOAD = 'UPLOAD - PUT',
    DELETE = 'DELETE',
    MKDIR = 'MKDIR',
    RMDIR = 'RMDIR'
}

export interface IErrorOptions {
    req: Request,
    res: Response,
    statusCode: number,
    method: FTPMethods,
    errorMessage?: string,
    invalidQueryParams?: boolean
}

export interface ISuccessOptions {
    req: Request,
    res: Response,
    statusCode: number,
    method: FTPMethods,
    stream?: NodeJS.ReadableStream,
    message?: string
    data?: any,
}