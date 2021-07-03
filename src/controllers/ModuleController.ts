import { Request, Response } from 'express';
import { getCustomRepository, Like } from 'typeorm';
import { ModulesRepository } from '@repositories/ModulesRepository';
import { AppError } from '@errors/AppError';
import { ClassesRepository } from '@repositories/ClassesRepository';
import { validateId, validateStore } from '@Utils/validators/moduleValidate';
import { formatDate } from '../services/dateFormatService';
class ModuleController {
  async store(request: Request, response: Response) {
    const { name } = request.body;
    // validation
    await validateStore({ name });

    const modulesRepository = getCustomRepository(ModulesRepository);
    const moduleAlreadyExists = await modulesRepository.findOne({ name });

    if (moduleAlreadyExists) {
      throw new AppError('User Already Exists!', 409);
    }

    try {
      const moduleData = modulesRepository.create({
        name
      });
      const moduleSaved = await modulesRepository.save(moduleData);
      return response.json(moduleSaved).status(201);
    } catch (error) {
      throw new AppError(error);
    }
  }

  async findAllModuleandClasses(request: Request, response: Response) {
    let data: any[] = [];
    const classesRepository = getCustomRepository(ClassesRepository);
    const modulesRepository = getCustomRepository(ModulesRepository);
    const moduleAlreadyExists = await modulesRepository.find({
      order: { name: 'ASC' }
    });
    await Promise.all(
      moduleAlreadyExists.map(async (moduleObj) => {
        const classAlreadyExists = await classesRepository.find({
          where: {
            module: moduleObj.id
          },
          order: { name: 'ASC' }
        });
        data.push({
          ...moduleObj,
          length: classAlreadyExists.length,
          classes: [await formatDate(classAlreadyExists)]
        });
        return data;
      })
    );

    return response.json(data).status(200);
  }

  async findOneModuleandAllClasses(request: Request, response: Response) {
    const { id } = request.params;
    const classesRepository = getCustomRepository(ClassesRepository);
    const modulesRepository = getCustomRepository(ModulesRepository);
    const moduleAlreadyExists = await modulesRepository.findOne({
      id
    });
    const singleClass = await classesRepository.find({
      where: {
        module: moduleAlreadyExists.id
      },
      order: { name: 'ASC' }
    });

    return response.json(await formatDate(singleClass)).status(200);
  }

  async destroy(request: Request, response: Response) {
    const { id } = request.params;
    // validation
    await validateId(id);

    const modulesRepository = getCustomRepository(ModulesRepository);
    const [moduleAlreadyExists] = await modulesRepository.find({ id });

    if (!moduleAlreadyExists) {
      throw new AppError('Class Not Found!', 404);
    }
    try {
      await modulesRepository.delete(moduleAlreadyExists.id);
      return response.status(200).json(await formatDate(moduleAlreadyExists));
    } catch (error) {
      throw new AppError(error);
    }
  }
}
export default new ModuleController();
