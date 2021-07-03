import UserController from '@controllers/UserController';
import { Router } from 'express';
const router = Router();

import { ensureMaster } from '@middlewares/ensureMaster';

// auth
router.post('/login', UserController.login);

router.post('/', UserController.store);

router.use(ensureMaster);

// find
router.get('/', UserController.findAll);
router.get('/', UserController.findByName);
// update
router.put('/:id', UserController.update);
// delete
router.delete('/:id', UserController.destroy);

export default router;
