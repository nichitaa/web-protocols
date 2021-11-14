/**
 * @author Pasecinic Nichita
 */
import dotenv from 'dotenv';
import {createFTPServer} from './src/createFTPServer';

dotenv.config();

class FTPServer {

    public static run() {
        const ftpSrv = createFTPServer({
            port: (process.env.FTP_PORT as string),
            host: (process.env.HOST_NAME as string),
            dir: (process.env.FTP_DIR as string),
            username: (process.env.FTP_USERNAME as string),
            password: (process.env.FTP_PASSWORD as string)
        });
        ftpSrv.listen()
            .then(() => console.log('FTP Server available on port: ', process.env.FTP_PORT));
    }

}

FTPServer.run();