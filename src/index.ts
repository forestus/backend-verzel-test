import 'reflect-metadata';
import express from 'express';
import 'express-async-errors';
import morgan from 'morgan';
import { errorMiddleware } from '@middlewares/errorMiddleware';
import cors from 'cors';
import createConnection from '@database/index';
import routes from '@routes/index';
import helmet from 'helmet';

const PORT = process.env.PORT || 3000;

// db connection
createConnection();

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
