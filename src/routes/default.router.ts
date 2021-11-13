import {Router} from 'express';
import {DefaultController} from '../controllers';
import {ApiRouter} from './interfaces';

export class DefaultRouter implements ApiRouter {
    private readonly router: Router;

    public constructor(private defaultController: DefaultController) {
        this.router = Router();
        this.initRoutes();
    }

    private initRoutes(): void {
        this.router.get('/', this.defaultController.get);
        this.router.post('/', this.defaultController.post);
    }

    public get Router(): Router {
        return this.router;
    }

}