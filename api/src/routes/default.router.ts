import {DefaultController} from '../controllers';
import {AppRouter} from '../types';
import {Router} from 'express';

export class DefaultRouter implements AppRouter {
    private readonly router: Router;

    public constructor(private defaultController: DefaultController) {
        this.router = Router();
        this.initRoutes();
    }

    initRoutes = (): void => {
        this.router.get('/', this.defaultController.get);
        this.router.post('/', this.defaultController.post);
    }

    public get Router(): Router {
        return this.router;
    }

}