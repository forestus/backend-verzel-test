import * as yup from 'yup';

export async function validateStore(name?, email?, password?) {
  const schema = yup.object().shape({
    name: yup.string().required(),
    email: yup.string().email().required('Email is Required'),
    password: yup
      .string()
      .oneOf([yup.ref('password'), null], 'Passwords must match')
      .required()
  });
  // check validity
  await schema.validate(
    {
      name,
      email,
      password
    },
    { abortEarly: false }
  );
}

export async function validateLogin(email?, password?) {
  const schema = yup.object().shape({
    email: yup.string().email().required('Email is Required'),
    password: yup
      .string()
      .oneOf([yup.ref('password'), null], 'Passwords must match')
      .required()
  });
  await schema.validate(
    {
      email,
      password
    },
    { abortEarly: false }
  );
}

export async function validateName(name?) {
  const schema = yup.object().shape({
    name: yup.string().required().max(30)
  });
  // check validity
  await schema.validate(
    {
      name
    },
    { abortEarly: false }
  );
}

export async function validateUpdate(name?, email?, password?) {
  const schema = yup.object().shape({
    name: yup.string(),
    email: yup.string().email(),
    password: yup
      .string()
      .oneOf([yup.ref('password'), null], 'Passwords must match')
      .required()
  });
  // check validity
  await schema.validate(
    {
      name,
      email,
      password
    },
    { abortEarly: false }
  );
}

export async function validateId(id) {
  const schema = yup.object().shape({
    id: yup.number().required()
  });
  // check validity
  await schema.validate({ id }, { abortEarly: false });
}
