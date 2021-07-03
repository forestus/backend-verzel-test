import ClassController from '@controllers/ClassController';
import { Router } from 'express';
const router = Router();
import { ensureAuthenticated } from '@middlewares/ensureAuthenticated';
router.use(ensureAuthenticated);
router.post('/:id', ClassController.store);
// find
// router.get('/', ClassController.findAllByNameLastName);
router.get('/:moduleId', ClassController.findOneModuleandClass);
// // update
router.put('/:moduleId', ClassController.update);
// router.patch('/:id', ClassController.updateNickname);
// // delete
router.delete('/:id', ClassController.destroy);
export default router;
