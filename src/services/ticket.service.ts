import { Ticket } from '../interfaces/ticket.interface';
import TicketModel from '../models/ticket.model';
import { HttpException } from '../exceptions/HttpException';
import { isEmpty } from '../util/isEmpty';
import UserModel from '../models/user.model';
import { isDataURI } from 'class-validator';
import { User } from '../interfaces/user.interface';
import { response } from 'express';

class TicketService {
  public ticketModel = TicketModel;
  public userModel = UserModel;
  public createTicket = async (ticketData: Ticket, user: User): Promise<string> => {
    if (user.role !== 'admin') {
      throw new HttpException(401, 'Invalid Authentication Token....');
    }
    if (isEmpty(ticketData)) {
      throw new HttpException(400, `Please Provide all values`);
    }
    const findTicket = await this.ticketModel.findOne({ _id: ticketData._id });
    if (findTicket) {
      throw new HttpException(409, `Your ticket ${ticketData.title} already exists`);
    }
    const isUserExist = await this.userModel.findOne({ username: ticketData.assignedTo });
    if (!isUserExist) {
      throw new HttpException(409, 'username does not exist');
    }
    const createTicket: Ticket = await this.ticketModel.create({ ...ticketData });
    return createTicket._id;
  };

  public getTicket = async (_id: string): Promise<Ticket> => {
    if (isEmpty(_id)) {
      throw new HttpException(400, 'Ticket does not exist.....');
    }
    const findTicket = await this.ticketModel.findById({ _id });
    if (!findTicket) {
      throw new HttpException(400, 'Ticket does not exist.....');
    }
    return findTicket;
  };

  public getTickets = async (): Promise<Ticket[]> => {
    const tickets = await this.ticketModel.find();
    return tickets;
  };

  public getTicketByStatus = async (status: string): Promise<Ticket[]> => {
    if (isEmpty(status)) throw new HttpException(409, 'Please enter a valid status');
    if (status === 'close' || status === 'open') {
      const tickets = await this.ticketModel.find({ status });
      return tickets;
    }
    throw new HttpException(409, 'Please enter a valid status');
  };

  public getTicketByTitle = async (title: string): Promise<Ticket> => {
    if (isEmpty(title)) throw new HttpException(409, 'Please enter a valid title');
    console.log(title);
    const ticket = await this.ticketModel.findOne({ title });
    if (!ticket) throw new HttpException(409, 'Ticket does not exist');
    return ticket;
  };

  public getTicketByPriority = async (priority: string): Promise<Ticket[]> => {
    if (isEmpty(priority)) throw new HttpException(409, 'Please enter a valid priority');
    if (priority === 'low' || priority === 'medium' || priority === 'high') {
      const tickets = await this.ticketModel.find({ priority });
      return tickets;
    }
    throw new HttpException(409, 'Please enter a valid priority');
  };

  public deleteTicket = async (_id: string, user: User): Promise<Ticket> => {
    if (user.role !== 'admin') {
      throw new HttpException(401, 'Invalid Authentication Token....');
    }
    if (isEmpty(_id)) {
      throw new HttpException(409, 'Please enter a valid id');
    }
    const ticket = await this.ticketModel.findByIdAndDelete({ _id });
    if (!ticket) {
      throw new HttpException(409, 'Ticket does not exist');
    }
    return ticket;
  };
}
export default TicketService;
