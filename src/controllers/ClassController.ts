import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { ClassesRepository } from '@repositories/ClassesRepository';
import { AppError } from '@errors/AppError';
import { ModulesRepository } from '@repositories/ModulesRepository';
import { validateId, validateStore } from '@Utils/validators/classValidate';
import moment from 'moment';
import { formatDate } from 'src/services/dateFormatService';
class ClassController {
  // Cria uma Aula.
  async store(request: Request, response: Response) {
    const { id } = request.params;
    const { name } = request.body;
    let { exhibition } = request.body;
    exhibition = new Date(exhibition);
    let dateFormat = '';
    // validation
    await validateId(id);
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
      const userSaved = await classesRepository.save(classData);
      return response.json(await formatDate(userSaved)).status(201);
    } catch (error) {
      throw new AppError(error);
    }
  }
}
export default new ClassController();
