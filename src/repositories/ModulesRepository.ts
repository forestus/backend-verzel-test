import { ModuleEntity } from '@models/ModuleEntity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(ModuleEntity)
class ModulesRepository extends Repository<ModuleEntity> {}
export { ModulesRepository };
