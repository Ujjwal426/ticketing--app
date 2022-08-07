import { Router } from 'express';
import { TicketController } from '../controllers/ticket.controller';
import { Routes } from '../interfaces/routes.interface';
import authMiddleware from '../middlewares/auth.middleware';

class TicketRoute implements Routes {
  public path = '/tickets';
  public router = Router();
  public ticketController = new TicketController();
  constructor() {
    this.initializeRoutes();
  }
  private initializeRoutes() {
    this.router.post(`${this.path}/new`, authMiddleware, this.ticketController.createTicket);
    this.router.get(`${this.path}/all`, this.ticketController.getTickets);
    this.router.get(`${this.path}/:id`, this.ticketController.getTicket);
    this.router.get(`${this.path}`, this.ticketController.getTicketBYQuery);
    this.router.post(`${this.path}/markAsClosed`, authMiddleware, this.ticketController.markedTicket);
  }
}

export default TicketRoute;
