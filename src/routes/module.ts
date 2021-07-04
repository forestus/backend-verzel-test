import ModuleController from '@controllers/ModuleController';
import { Router } from 'express';
const router = Router();
import { ensureAuthenticated } from '@middlewares/ensureAuthenticated';

router.get('/', ModuleController.findAllModuleandClasses);
router.get('/:id', ModuleController.findOneModuleandAllClasses);

router.use(ensureAuthenticated);

router.post('/', ModuleController.store);
router.put('/:id', ModuleController.update);
router.delete('/:id', ModuleController.destroy);

export default router;
