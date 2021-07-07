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
    throw new AppError('Formato de Data Inválido!', 400);
  }
}

export async function validateUpdate({ name }) {
  const schema = yup.object().shape({
    name: yup.string().required()
  });
  // check validity
  await schema.validate({ name }, { abortEarly: false });
}
