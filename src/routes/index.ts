import { Router } from 'express';
import userRouter from './user';
import classRouter from './class';
import moduleRouter from './module';

const routes = Router();

routes.use('/class', classRouter);
routes.use('/module', moduleRouter);
routes.use('/users', userRouter);

export default routes;
