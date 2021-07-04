import ClassController from '@controllers/ClassController';
import { Router } from 'express';
const router = Router();
import { ensureAuthenticated } from '@middlewares/ensureAuthenticated';
router.get('/:id', ClassController.findOneClass);

router.use(ensureAuthenticated);

router.post('/', ClassController.store);
router.put('/:id', ClassController.update);
router.delete('/:id', ClassController.destroy);

export default router;
