/**
 * @author Pasecinic Nichita
 */

import {App} from './src';

class APIServer {
    public static run() {
        const app = new App();
        app.listen();
    }
}

APIServer.run();