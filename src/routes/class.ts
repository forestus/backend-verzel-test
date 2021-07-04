import ClassController from '@controllers/ClassController';
import { Router } from 'express';
const router = Router();
import { ensureAuthenticated } from '@middlewares/ensureAuthenticated';
router.get('/:moduleId', ClassController.findOneModuleandClass);

router.use(ensureAuthenticated);

router.post('/:id', ClassController.store);
router.put('/:moduleId', ClassController.update);
router.delete('/:id', ClassController.destroy);

export default router;
