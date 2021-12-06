import Client from 'ftp';
import path from 'path';
import * as fs from 'fs';
import {FTPMethods, IFtpResponse} from '../types';


export default class FTPClient {
    private client: Client;

    public constructor(clientOptions: Client.Options) {
        this.client = new Client();
        this.client.connect(clientOptions);
    }

    /**
     * List the content from the specified path on FTP server
     * @param path
     */
    public list = (path: string | undefined): Promise<IFtpResponse> => {
        return new Promise((resolve, reject) => {
            if (!path) reject('No query param `path` was provided!');
            this.client.list(path!, (err, list) => {
                if (err) reject({method: FTPMethods.LIST, message: err.message});
                resolve({
                    method: FTPMethods.LIST,
                    data: list,
                    message: `results of LIST command in directory: ${path}`
                });
            });
        });
    };

    /**
     * Responses with the file stream of the requested FTP server file for a specified path
     * @param path
     */
    public download = (path: string | undefined): Promise<IFtpResponse> => {
        return new Promise((resolve, reject) => {
            if (!path) reject('No query param `path` was provided!');
            this.client.get((path as string), (err, stream) => {
                if (err) reject({method: FTPMethods.DOWNLOAD, message: err.message});
                resolve({stream, method: FTPMethods.DOWNLOAD, message: 'downloaded successful'});
            });
        });
    };

    /**
     * Uploads the file from previously saved multer temporary location directly to a specified FTP server path
     * @param dirPath
     * @param filename
     */
    public upload = (dirPath: string | undefined, filename: string): Promise<IFtpResponse> => {
        return new Promise((resolve, reject) => {
            if (!dirPath) reject('No query param `path` was provided!');
            const tempPath = path.resolve(__dirname, `../temp/${filename}`);
            this.client.put(fs.createReadStream(tempPath), `${dirPath}/${filename}`, err => {
                if (err) reject({method: FTPMethods.UPLOAD, message: err.message});
                fs.unlinkSync(tempPath);
                resolve({
                    method: FTPMethods.UPLOAD,
                    message: `file: ${filename} successfully uploaded to path: ${dirPath}/${filename}!`
                });
            });
        });
    };

    /**
     * Deletes a file from the specified path
     * @param path
     */
    public delete = (path: string | undefined): Promise<IFtpResponse> => {
        return new Promise((resolve, reject) => {
            if (!path) reject('No query param `path` was provided!');
            this.client.delete(path!, (err) => {
                if (err) reject({method: FTPMethods.DELETE, message: err.message});
                resolve({method: FTPMethods.DELETE, message: `file: ${path} was successfully deleted!`});
            });
        });
    };

    /**
     * Creates a directory
     * @param path
     */
    public mkdir = (path: string | undefined): Promise<IFtpResponse> => {
        return new Promise((resolve, reject) => {
            if (!path) reject({method: FTPMethods.MKDIR, message: 'No query param `path` was provided!'});
            this.client.mkdir(path!, true, (err) => {
                if (err) reject(err.message);
                resolve({method: FTPMethods.MKDIR, message: `directory ${path} was successfully created!`});
            });
        });
    };

    /**
     * Deletes a directory if empty
     * @param path
     */
    public rmdir = (path: string | undefined): Promise<IFtpResponse> => {
        return new Promise((resolve, reject) => {
            if (!path) reject('No query param `path` was provided!');
            this.client.rmdir(path!, false, (err) => {
                if (err) reject({message: err.message, method: FTPMethods.RMDIR});
                resolve({method: FTPMethods.RMDIR, message: `directory ${path} was successfully deleted!`});
            });
        });
    };

}