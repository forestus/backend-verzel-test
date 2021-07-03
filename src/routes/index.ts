import { Router } from 'express';
import userRouter from './user';
import classRouter from './class';
import moduleRouter from './module';

const routes = Router();

routes.use('/users', userRouter);
routes.use('/class', classRouter);
routes.use('/module', moduleRouter);

export default routes;
