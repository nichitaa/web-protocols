import {DefaultRouter} from './default.router';
import {DefaultController} from '../controllers';

export const routes = [
    new DefaultRouter(new DefaultController())
]