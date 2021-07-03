import { ClassEntity } from '@models/ClassEntity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(ClassEntity)
class ClassesRepository extends Repository<ClassEntity> {}
export { ClassesRepository };
