import {Express, Request, Response} from 'express';
import responseInterceptor from '../shared/middlewares/response-interceptor';
import {exceptionHandler} from '../shared/middlewares/exception-handling.middleware';
import {pageNotFoundExceptionHandler} from '../shared/middlewares/page-not-found-exception-handler.middleware';
import UsersRouter from '../controllers/user.controller';
import MetricsController from "../controllers/metrics.controller";
import ActivityController from "../controllers/activity.controller";

const routerSetup = (app: Express) =>
    app

        .get('/', async (req: Request, res: Response) => {
            res.send('Hello from Fitbit-Clone-Backend');
        })

        .use(responseInterceptor)
        .use('/api/v1/users', UsersRouter)
        .use('/api/v1/metrics', MetricsController)
        .use('/api/v1/activity', ActivityController)

        //not found handler
        .use('*', pageNotFoundExceptionHandler)

        // The exception handling middleware
        .use(exceptionHandler)

export default routerSetup;
