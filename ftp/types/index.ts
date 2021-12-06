export enum FTPMethods {
    LIST = 'LIST',
    DOWNLOAD = 'DOWNLOAD - GET',
    UPLOAD = 'UPLOAD - PUT',
    DELETE = 'DELETE',
    MKDIR = 'MKDIR',
    RMDIR = 'RMDIR'
}

export interface IFtpResponse {
    method: FTPMethods;
    message: string;
    stream?: NodeJS.ReadableStream;
    data?: any;
}