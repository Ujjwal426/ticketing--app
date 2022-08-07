import { Schema, model, Mongoose } from 'mongoose';
import { Ticket } from '../interfaces/ticket.interface';

const ticketSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['open', 'close'],
      default: 'open',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'low',
    },
    assignedTo: {
      type: Schema.Types.String,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default model<Ticket>('Ticket', ticketSchema);
