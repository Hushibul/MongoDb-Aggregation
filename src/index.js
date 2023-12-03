import express from 'express';
import userRouter from './routes/userRouter.js';

const app = express();

app.use('/api/user', userRouter);

app.listen(5000, () => console.log('Server is running at port 5000'));
