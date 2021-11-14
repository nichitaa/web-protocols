import {Request, Response, NextFunction} from 'express';


export default class DefaultController {
    public constructor() {};

    public get(req: Request, res: Response, next: NextFunction): void {
        res.send({isSuccess: true, method: 'GET', message: 'Server is up and running!'})
    }

    public post(req: Request, res: Response, next: NextFunction): void {
        res.send({isSuccess: true, method: 'POST', requestBody: req.body})
    }
}