import { AppError } from '@errors/AppError';
import moment from 'moment';
import * as yup from 'yup';

export async function validateId(id) {
  const schema = yup.object().shape({
    id: yup.number().required()
  });
  // check validity
  await schema.validate({ id }, { abortEarly: false });
}

export async function validateStoreAndUpdate({ name, exhibition }) {
  const schema = yup.object().shape({
    name: yup.string().required()
  });
  // check validity
  await schema.validate({ name }, { abortEarly: false });
  if (!moment(exhibition, 'YYYY-MM-DDTHH:mm:ss').isValid()) {
    throw new AppError(
      "invalid input syntax for Exhibition Date/Hour: 'exhibition':'Wed Jul 21 2021 01:02:00 GMT-0300 (Brasilia Standard Time)'",
      400
    );
  }
}

export async function validateUpdate({ name }) {
  const schema = yup.object().shape({
    name: yup.string().required()
  });
  // check validity
  await schema.validate({ name }, { abortEarly: false });
}
