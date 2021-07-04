import 'reflect-metadata';
import 'express-async-errors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import routes from '@routes/index';
import createConnection from '@database/index';
import { errorMiddleware } from '@middlewares/errorMiddleware';
import { UsersRepository } from '@repositories/UsersRepository';
import { getCustomRepository } from 'typeorm';

const PORT = process.env.PORT || 3000;

// db connection
createConnection().then(async (connection) => {
  // create master
  const email = 'forestus7@gmail.com'.toLowerCase();
  const userRepository = getCustomRepository(UsersRepository);
  const userAlreadyExists = await userRepository.findOne({
    email
  });
  if (!userAlreadyExists) {
    const userData = userRepository.create({
      name: 'Guilherme',
      email,
      master: true,
      password: '123456'
    });
    await userRepository.save(userData);
  }
});

// app config
const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('tiny'));
app.use(routes);
app.use(errorMiddleware);

// server
app.listen(PORT, () => {
  console.log(`Server Running at http://localhost:${PORT}`);
});
