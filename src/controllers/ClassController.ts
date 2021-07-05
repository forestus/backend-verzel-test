import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { ClassesRepository } from '@repositories/ClassesRepository';
import { ModulesRepository } from '@repositories/ModulesRepository';
import { formatDate } from '@services/dateFormatService';
import { AppError } from '@errors/AppError';
import moment from 'moment';
import {
  validateId,
  validateStoreAndUpdate
} from '@Utils/validators/classValidate';

class ClassController {
  async store(request: Request, response: Response) {
    const { id_module, name } = request.body;
    let { exhibition } = request.body;
    exhibition = new Date(exhibition);
    await validateId(Number(id_module));
    await validateStoreAndUpdate({
      name: name,
      exhibition: exhibition
    });

    const classesRepository = getCustomRepository(ClassesRepository);
    const modulesRepository = getCustomRepository(ModulesRepository);

    const moduleAlreadyExists = await modulesRepository.findOne({
      id: id_module
    });

    if (!moduleAlreadyExists) {
      throw new AppError('Módulo Não Encontrado!', 404);
    }

    const classAlreadyExists = await classesRepository.findOne({ name });

    if (classAlreadyExists) {
      throw new AppError('Aula Não Encontrada!', 409);
    }

    const dateFormated = moment(exhibition, 'YYYY-MM-DDTHH:mm:ss').format(
      'YYYY-MM-DDTHH:mm:ss'
    );

    try {
      const classData = classesRepository.create({
        name,
        exhibition: dateFormated,
        module: moduleAlreadyExists
      });
      const classSaved = await classesRepository.save(classData);
      return response.json(await formatDate(classSaved)).status(201);
    } catch (error) {
      throw new AppError(error);
    }
  }

  async findOneClass(request: Request, response: Response) {
    const { id } = request.params;

    await validateId(Number(id));

    const classesRepository = getCustomRepository(ClassesRepository);

    const classAlreadyExists = await classesRepository.findOne({
      id
    });

    if (!classAlreadyExists) {
      throw new AppError('Aula Não Encontrada!', 404);
    }
    return response.json(await formatDate(classAlreadyExists)).status(200);
  }

  async update(request: Request, response: Response) {
    const { id } = request.params;
    const { name } = request.body;
    let { exhibition } = request.body;
    exhibition = new Date(exhibition);
    await validateId(Number(id));
    await validateStoreAndUpdate({
      name: name,
      exhibition: exhibition
    });

    const classesRepository = getCustomRepository(ClassesRepository);
    const classAlreadyExists = await classesRepository.findOne({
      id
    });
    if (!classAlreadyExists) {
      throw new AppError('Aula Não Encontrada!', 404);
    }
    if (
      classAlreadyExists.name == name &&
      classAlreadyExists.exhibition == exhibition
    ) {
      throw new AppError('Esta Alteração já foi feita!', 409);
    }
    const dateFormated: any = moment(exhibition, 'YYYY-MM-DDTHH:mm:ss').format(
      'YYYY-MM-DDTHH:mm:ss'
    );
    try {
      const classToUpdate = await classesRepository.save({
        ...classAlreadyExists,
        name,
        exhibition: dateFormated
      });
      classToUpdate.exhibition = classToUpdate.exhibition.replace('T', ' ');
      return response.json(classToUpdate).status(200);
    } catch (error) {
      throw new AppError(error);
    }
  }

  async destroy(request: Request, response: Response) {
    const { id } = request.params;
    await validateId(id);

    const classesRepository = getCustomRepository(ClassesRepository);
    const classAlreadyExists = await classesRepository.findOne({ id });

    if (!classAlreadyExists) {
      throw new AppError('Aula Não Encontrada!', 404);
    }

    try {
      await classesRepository.delete(classAlreadyExists.id);
      return response.sendStatus(200);
    } catch (error) {
      throw new AppError(error);
    }
  }
}
export default new ClassController();
