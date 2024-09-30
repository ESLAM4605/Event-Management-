import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateEventDto } from './dtos/create-event.dto';
import { UpdateEventDto } from './dtos/update-event.dto';
import { Event, EventDocument } from './schema/event.schema';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
  ) {}

  async create(createEventDto: CreateEventDto): Promise<Event> {
    const { date } = createEventDto;

    if (new Date(date) < new Date()) {
      throw new BadRequestException('Event date cannot be in the past.');
    }

    const createdBy = "Assuming it's there";
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const eventsToday = await this.eventModel.countDocuments({
      createdBy: createdBy,
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });

    if (eventsToday >= 5) {
      throw new BadRequestException(
        'User has exceeded the event creation limit for today.',
      );
    }
    const event = new this.eventModel({
      ...createEventDto,
      createdBy,
      date: new Date(createEventDto.date),
    });
    return event.save();
  }

  async update(id: string, updateEventDto: UpdateEventDto): Promise<Event> {
    const { date } = updateEventDto;

    if (date && new Date(date) < new Date()) {
      throw new BadRequestException('Event date cannot be in the past.');
    }

    const event = await this.eventModel.findByIdAndUpdate(id, updateEventDto, {
      new: true,
    });
    if (!event) {
      throw new NotFoundException('Event not found.');
    }

    return event;
  }

  async delete(id: string): Promise<void> {
    const event = await this.eventModel.findByIdAndDelete(id);
    if (!event) {
      throw new NotFoundException('Event not found.');
    }
  }

  async find(id?: string): Promise<Event | Event[]> {
    if (id) {
      const event = await this.eventModel.findById(id);
      if (!event) {
        throw new NotFoundException('Event not found.');
      }
      return event;
    }
    return this.eventModel.find().exec();
  }

  async rsvp(id: string, username: string): Promise<Event> {
    const event = await this.eventModel.findById(id);
    if (!event) {
      throw new NotFoundException('Event not found.');
    }

    if (new Date(event.date) < new Date()) {
      throw new BadRequestException('Cannot RSVP to past events.');
    }

    if (event.rsvps.includes(username)) {
      throw new BadRequestException('User has already RSVPed to this event.');
    }

    event.rsvps.push(username);
    return event.save();
  }
}
