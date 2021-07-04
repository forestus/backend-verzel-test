import { Router } from 'express';
import userRouter from './user';
import classRouter from './class';
import moduleRouter from './module';

const routes = Router();

routes.use('/classes', classRouter);
routes.use('/modules', moduleRouter);
routes.use('/users', userRouter);

export default routes;
