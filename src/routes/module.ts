import ModuleController from '@controllers/ModuleController';
import { Router } from 'express';
const router = Router();
import { ensureAuthenticated } from '@middlewares/ensureAuthenticated';
router.get('/', ModuleController.findAllModuleandClasses);
router.use(ensureAuthenticated);
router.post('/', ModuleController.store);
// // find
router.get('/:id', ModuleController.findOneModuleandAllClasses);
// // update
router.put('/:id', ModuleController.update);
// router.patch('/:id', ModuleController.updateNickname);
// // delete
router.delete('/:id', ModuleController.destroy);
export default router;
