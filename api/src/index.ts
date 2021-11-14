/**
 * @author Pasecinic Nichita
 */

import express from 'express';
import cors from 'cors';
import {createApiServer} from './createApiServer';
import fs from 'fs';
import path from 'path';
import * as https from 'https';
import {routes} from './routes';
import dotenv from 'dotenv';

dotenv.config();

export class App {
    private readonly app: express.Express;
    private apiServer;

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
        this.apiServer = createApiServer(this.app, httpsConfig);
    }

    public listen() {
        this.apiServer.listen((process.env.API_PORT as string), () => console.log(`Api Server available on port: ${process.env.API_PORT}...`));
    }

}