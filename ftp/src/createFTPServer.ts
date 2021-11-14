import {FtpSrv} from 'ftp-srv';
import * as path from 'path';

export interface IFTPConfig {
    port: string,
    host: string,
    dir: string,
    username: string,
    password: string
}

/**
 * @param config IFTPConfig
 * @returns ftpSrv FTP server with the given configuration object
 */
export const createFTPServer = (config: IFTPConfig): FtpSrv => {

    const ftpSrv = new FtpSrv({
        url: `ftp://${config.host}:${config.port}`,
        greeting: 'You have successfully connected to FTP server!',
        pasv_url: config.host
    });

    ftpSrv.on('login', (data, resolve, reject) => {
        if (data.username === config.username && data.password === config.password) {
            // will server the `srv` directory
            resolve({root: path.resolve(__dirname, config.dir)});
        } else {
            reject(Error('Wrong FTP credentials'));
        }
    });

    ftpSrv.on('client-error', ({connection, error, context}) => {
        console.log(`FTP client error:`);
        console.log(`FTP client error, context: `, context);
        console.log(`FTP client error, error: `, error);
    });

    return ftpSrv;

};

