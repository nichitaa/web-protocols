/**
 * @author Pasecinic Nichita
 */

import {Express} from 'express';
import * as https from 'https';
import * as net from 'net';
import * as http from 'http';

export enum PROTOCOL_ENUM {
    HTTP = 'http',
    HTTPS = 'https'
}

/**
 * @param app Express handler application
 * @param opts Configuration object for node https server
 * @returns server - TCP server that will proxy the request to relevant HTTP implementation directly
 */
export const createServer = (app: Express, opts: https.ServerOptions) => {

    let httpProxy = http.createServer(app);
    let httpsProxy = https.createServer(opts, app);

    return net.createServer((socket) => {

        socket.once('data', (buffer) => {

            socket.pause();
            const byte = buffer[0];
            const protocol = getProtocolByFirstByte(byte);

            // push the buffer back onto the front of the data stream
            socket.unshift(buffer);

            switch (protocol) {
                case PROTOCOL_ENUM.HTTP: {
                    httpProxy.emit('connection', socket);
                    break;
                }
                case PROTOCOL_ENUM.HTTPS: {
                    httpsProxy.emit('connection', socket);
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
