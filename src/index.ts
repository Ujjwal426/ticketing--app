import express, { application } from 'express';
import 'dotenv/config';
import './config/database';
import TicketRoute from './routes/ticket.route';
import UserRoute from './routes/user.route';
import { errorMiddleware } from './middlewares/error.middleware';
import { notFoundMiddleware } from './middlewares/notfound.middleware';
import morgan from 'morgan';

const PORT: number = parseInt(process.env.PORT || '3000');
const app = express();
const ticketRoutes = new TicketRoute();
const userRoute = new UserRoute();

app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', ticketRoutes.router, userRoute.router);
app.use(notFoundMiddleware);
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server on the runnung PORT http://localhost:${PORT}`);
});
