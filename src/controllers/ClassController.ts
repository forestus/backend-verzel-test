import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { ClassesRepository } from '@repositories/ClassesRepository';
import { AppError } from '@errors/AppError';
import { ModulesRepository } from '@repositories/ModulesRepository';
import {
  validateId,
  validateStore,
  validateUpdate
} from '@Utils/validators/classValidate';
import moment from 'moment';
import { formatDate } from '@services/dateFormatService';
class ClassController {
  // Cria uma Aula.
  async store(request: Request, response: Response) {
    const { id, name } = request.body;
    let { exhibition } = request.body;
    exhibition = new Date(exhibition);
    let dateFormat = '';
    // validation
    await validateId(+id);
    await validateStore({
      name: name
    });
    if (moment(exhibition, 'YYYY-MM-DDTHH:mm:ss').isValid()) {
      dateFormat = moment(exhibition, 'YYYY-MM-DDTHH:mm:ss').format(
        'YYYY-MM-DDTHH:mm:ss'
      );
    } else {
      throw new AppError(
        "invalid input syntax for Exhibition Date/Hour: 'exhibition':'Wed Jul 21 2021 01:02:00 GMT-0300 (Brasilia Standard Time)'",
        400
      );
    }

    const classesRepository = getCustomRepository(ClassesRepository);
    const modulesRepository = getCustomRepository(ModulesRepository);

    const moduleAlreadyExists = await modulesRepository.findOne({ id });
    const classAlreadyExists = await classesRepository.findOne({ name });
    if (classAlreadyExists) {
      throw new AppError('Class Name Already Exists!', 409);
    }
    try {
      const classData = classesRepository.create({
        name,
        exhibition: dateFormat,
        module: moduleAlreadyExists
      });
      const classSaved = await classesRepository.save(classData);
      return response.json(await formatDate(classSaved)).status(201);
    } catch (error) {
      throw new AppError(error);
    }
  }

  async findOneModuleandClass(request: Request, response: Response) {
    const { moduleId } = request.params;
    const { id } = request.body;
    const classesRepository = getCustomRepository(ClassesRepository);

    const classAlreadyExists = await classesRepository.findOne({
      where: { module: moduleId, id }
    });

    return response.json(await formatDate(classAlreadyExists)).status(200);
  }
  async update(request: Request, response: Response) {
    const { moduleId } = request.params;
    const { id, name } = request.body;
    let { exhibition } = request.body;
    exhibition = new Date(exhibition);
    // validation
    await validateId(id);
    // await validateUpdate(name);

    if (!moment(exhibition).isValid()) {
      throw new AppError(
        "invalid input syntax for Exhibition Date/Hour: 'exhibition':'Wed Jul 21 2021 01:02:00 GMT-0300 (Brasilia Standard Time)'",
        400
      );
    }
    const classesRepository = getCustomRepository(ClassesRepository);
    const classAlreadyExists = await classesRepository.findOne({
      where: { module: moduleId, id: +id }
    });
    if (!classAlreadyExists) {
      throw new AppError('Class Not Found!', 404);
    }
    if (
      classAlreadyExists.name == name &&
      classAlreadyExists.exhibition == exhibition
    ) {
      throw new AppError('Class Params Already Exists!', 409);
    }
    const dateToFomat: any = moment(exhibition, 'YYYY-MM-DDTHH:mm:ss').format(
      'YYYY-MM-DDTHH:mm:ss'
    );
    try {
      const classToUpdate = await classesRepository.save({
        ...classAlreadyExists,
        name,
        exhibition: dateToFomat
      });
      classToUpdate.exhibition = classToUpdate.exhibition.replace('T', ' ');
      return response.json(classToUpdate).status(200);
    } catch (error) {
      throw new AppError(error);
    }
  }

  async destroy(request: Request, response: Response) {
    const { id } = request.params;
    // validation
    await validateId(id);

    const classesRepository = getCustomRepository(ClassesRepository);
    const [classAlreadyExists] = await classesRepository.find({ id });

    if (!classAlreadyExists) {
      throw new AppError('Class Not Found!', 404);
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
