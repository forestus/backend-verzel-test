import ClassController from '@controllers/ClassController';
import { Router } from 'express';
const router = Router();

import { ensureAuthenticated } from '@middlewares/ensureAuthenticated';
import { ensureAdmin } from '@middlewares/ensureAdmin';

router.post('/:id', ClassController.store);
// find
// router.get('/', ClassController.findAllByNameLastName);
// router.get('/:id', ClassController.findByModule);
// // update
// router.put('/:id', ClassController.update);
// router.patch('/:id', ClassController.updateNickname);
// // delete
// router.delete('/:id', ClassController.destroy);
export default router;
