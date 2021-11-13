/**
 * @author Pasecinic Nichita
 */

import express from 'express';
import cors from 'cors';
import {createServer} from './createServer';
import fs from 'fs';
import path from 'path';
import * as https from 'https';
import {routes} from './routes';

export class App {
    private readonly app: express.Express;
    private PORT = 8080;
    private server;

    public constructor() {
        this.app = express();
        this.bootstrap();
    }

    private bootstrap() {
        this.initAppMiddlewares();
        this.initAppRoutes();
        this.initServer();
    }

    private initAppMiddlewares() {
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended: true}));
    }

    private initAppRoutes() {
        routes.forEach(route => this.app.use(route.Router));
    }

    private initServer() {
        const httpsConfig: https.ServerOptions = {
            key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
            cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem'))
        };
        this.server = createServer(this.app, httpsConfig);
    }

    public listen() {
        this.server.listen(this.PORT, () => console.log('Server started'));
    }

}