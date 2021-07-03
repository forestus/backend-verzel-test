import * as yup from 'yup';

export async function validateId(id) {
  const schema = yup.object().shape({
    id: yup.number().required()
  });
  // check validity
  await schema.validate({ id }, { abortEarly: false });
}

export async function validateStore({ name }) {
  const schema = yup.object().shape({
    name: yup.string().required()
  });
  // check validity
  await schema.validate(
    {
      name
    },
    { abortEarly: false }
  );
}
