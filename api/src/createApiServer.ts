/**
 * @author Pasecinic Nichita
 */

import httpProxy from 'http-proxy';
import {Express} from 'express';
import * as https from 'https';
import * as http from 'http';
import * as net from 'net';
import dotenv from 'dotenv';

dotenv.config();

export enum PROTOCOL_ENUM {
    HTTP = 'http',
    HTTPS = 'https'
}

/**
 * @param app Express handler application
 * @param opts Configuration object for node https server
 * @returns server - TCP server that will proxy the request to relevant HTTP implementation
 */
export const createApiServer = (app: Express, opts: https.ServerOptions) => {

    let proxy = httpProxy.createProxyServer({
        changeOrigin: true,
        target:  `${PROTOCOL_ENUM.HTTPS}://${process.env.HOST_NAME}:${process.env.API_PORT}`, // 'https://localhost:8080',
        secure: false
    });

    let httpServer = http.createServer((req, res) => proxy.web(req, res));
    let httpsServer = https.createServer(opts, app);

    return net.createServer((socket) => {

        socket.once('data', (buffer) => {

            socket.pause();
            const byte = buffer[0];
            const protocol = getProtocolByFirstByte(byte);
            console.log({protocol});

            // push the buffer back onto the front of the data stream
            socket.unshift(buffer);

            switch (protocol) {
                case PROTOCOL_ENUM.HTTP: {
                    httpServer.emit('connection', socket);
                    break;
                }
                case PROTOCOL_ENUM.HTTPS: {
                    httpsServer.emit('connection', socket);
                    break;
                }
                default: {
                    throw new Error(`Not implemented for byte: ${byte}`);
                }
            }

            process.nextTick(() => socket.resume());

        });
    });
};


/**
 * @param byte first buffer byte
 * @returns PROTOCOL_ENUM
 */
export const getProtocolByFirstByte = (byte: number): PROTOCOL_ENUM | undefined => {
    if (byte === 22) {
        return PROTOCOL_ENUM.HTTPS;
    } else if (32 < byte && byte < 127) {
        return PROTOCOL_ENUM.HTTP;
    } else {
        return undefined;
    }
};
