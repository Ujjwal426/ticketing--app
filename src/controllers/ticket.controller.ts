import e, { Request, Response, NextFunction } from 'express';
import { Ticket } from '../interfaces/ticket.interface';
import TicketService from '../services/ticket.service';
import { isEmpty } from '../util/isEmpty';
import { HttpException } from '../exceptions/HttpException';
import TicketModel from '../models/ticket.model';

export class TicketController {
  public ticketService = new TicketService();
  public ticketModel = TicketModel;
  public createTicket = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reqBody: Ticket = req.body;
      const { user } = req.body;
      console.log(user);
      const createTicket: string = await this.ticketService.createTicket(reqBody, user);
      res.status(200).json({ ticketId: createTicket, data: 'Ticket created' });
    } catch (error) {
      next(error);
    }
  };

  public getTicket = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ticketId = req.params.id;
      const ticket: Ticket = await this.ticketService.getTicket(ticketId);

      res.status(200).json({ data: ticket, message: 'Ticket details' });
    } catch (error) {
      next(error);
    }
  };

  public getTickets = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllTicekts: Ticket[] = await this.ticketService.getTickets();
      res.status(200).json({ tickets: findAllTicekts, message: 'List of all tickets' });
    } catch (error) {
      next(error);
    }
  };

  public getTicketBYQuery = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const status = req.query.status;
      const title = req.query.title;
      const priority = req.query.priority;
      if (status) {
        const tickets = await this.ticketService.getTicketByStatus(status.toString());
        res.status(200).json({ tickets, message: 'List of ticket followed by status' });
      } else if (title) {
        const ticket = await this.ticketService.getTicketByTitle(title.toString());
        res.status(200).json({ ticket, message: 'List of ticket followed by title' });
      } else if (priority) {
        const ticket = await this.ticketService.getTicketByPriority(priority.toString());
        res.status(200).json({ ticket, message: 'List of ticket followed by priority' });
      }
      throw new HttpException(409, 'Please enter a valid parameters');
    } catch (error) {
      next(error);
    }
  };

  public markedTicket = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const _id = req.params.id;
      const { user } = req.body;
      if (isEmpty(_id)) throw new HttpException(409, 'Please enter a valid ticket id');
      const ticketData: Ticket = await this.ticketModel.findById({ _id });
      if (!ticketData) throw new HttpException(409, 'Ticket does not exist');
      if (ticketData.status === 'close') {
        throw new HttpException(409, 'Ticket is already closed');
      }
      if (!(user.role !== 'admin') || !(user.username !== ticketData.assignedTo)) {
        throw new HttpException(409, 'Invalid Authentication Token....');
      }
      const tickets: Ticket[] = await this.ticketModel.find({ assignedTo: user.username });
      let bool = false;
      let task = [];
      if (ticketData.priority === 'low') {
        for (let i = 0; i < tickets.length; i++) {
          if (tickets[i].priority === 'medium' && tickets[i].status === 'open') {
            task.push(tickets[i]);
            bool = true;
          } else if (tickets[i].priority === 'high' && tickets[i].status === 'open') {
            task.push(tickets[i]);
            bool = true;
          }
        }
      } else if (ticketData.priority === 'medium') {
        for (let i = 0; i < tickets.length; i++) {
          if (tickets[i].priority === 'high' && tickets[i].status === 'open') {
            task.push(tickets[i]);
            bool = true;
          }
        }
      }
      if (bool) {
        res.status(409).json({
          error: 'A higher priority task remains to be closed',
          task,
        });
      } else {
        const ticket = await this.ticketModel.findByIdAndUpdate(_id, { status: 'close' }, { new: true });
        res.status(200).json({ message: 'Ticket mark as closed' });
      }
    } catch (error) {
      next(error);
    }
  };
}
