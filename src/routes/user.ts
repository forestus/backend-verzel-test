import UserController from '@controllers/UserController';
import { Router } from 'express';
const router = Router();

import { ensureAuthenticated } from '@middlewares/ensureAuthenticated';
import { ensureAdmin } from '@middlewares/ensureAdmin';
import { ensureMaster } from '@middlewares/ensureMaster';

router.post('/', UserController.store);
// find
router.get('/', UserController.findAll);
router.get('/', UserController.findByName);
// update
router.put('/:id', UserController.update);
router.patch(
  '/:id',
  ensureAuthenticated,
  ensureMaster,
  UserController.updateAdmin
);
// delete
router.delete('/:id', UserController.destroy);

// auth
router.get('/login', UserController.login);

export default router;
