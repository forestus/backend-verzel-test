import ModuleController from '@controllers/ModuleController';
import { Router } from 'express';
const router = Router();

import { ensureAuthenticated } from '@middlewares/ensureAuthenticated';
import { ensureAdmin } from '@middlewares/ensureAdmin';

router.post('/', ModuleController.store);
// // find
router.get('/', ModuleController.findAllModuleandClasses);
router.get('/:id', ModuleController.findOneModuleandClass);
// // update
// router.put('/:id', ModuleController.update);
// router.patch('/:id', ModuleController.updateNickname);
// // delete
// router.delete('/:id', ModuleController.destroy);
export default router;
