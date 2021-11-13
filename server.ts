/**
 * @author Pasecinic Nichita
 */

import {App} from './src';

class Server {
    public static run(): void {
        const app = new App();
        app.listen();
    }
}

Server.run();