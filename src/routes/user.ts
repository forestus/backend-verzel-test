import UserController from '@controllers/UserController';
import { Router } from 'express';
const router = Router();

import { ensureMaster } from '@middlewares/ensureMaster';

router.post('/login', UserController.login);
router.post('/', UserController.store);

router.use(ensureMaster);

router.get('/', UserController.findAll);
router.get('/:id', UserController.findOne);
router.put('/:id', UserController.update);
router.delete('/:id', UserController.destroy);

export default router;
