import { service } from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  getWhereSchemaFor,
  param,
  patch,
  post,
  requestBody,
} from '@loopback/rest';
import {
  Event,
  EventTranslation,
} from '../models';
import { EventRepository } from '../repositories';
import { MarkdownConverterService } from '../services/markdown-converter.service';
import {authenticate} from '@loopback/authentication';

import {EtranslationService} from '../services/etranslation.service'

@authenticate('micado')
export class EventEventTranslationController {
  constructor(
    @repository(EventRepository) protected eventRepository: EventRepository,
    @service() public etranslationService: EtranslationService

  ) { }

  @get('/events/{id}/event-translations', {
    responses: {
      '200': {
        description: 'Array of Event has many EventTranslation',
        content: {
          'application/json': {
            schema: { type: 'array', items: getModelSchemaRef(EventTranslation) },
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<EventTranslation>,
  ): Promise<EventTranslation[]> {
    return this.eventRepository.translations(id).find(filter);
  }

  @post('/events/{id}/event-translations', {
    responses: {
      '200': {
        description: 'Event model instance',
        content: { 'application/json': { schema: getModelSchemaRef(EventTranslation) } },
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Event.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(EventTranslation, {
            title: 'NewEventTranslationInEvent',
            //           exclude: ['id'],
            optional: ['id']
          }),
        },
      },
    }) eventTranslation: EventTranslation,
    //    }) eventTranslation: Omit < EventTranslation, 'id' >,
  ): Promise<EventTranslation> {
    if(eventTranslation.translated){
      if(eventTranslation.description){
        await this.etranslationService.getTranslation(eventTranslation.description, id.toString(), 'event', 'description')
      }
      await new Promise(r => setTimeout(r, 500));
      if(eventTranslation.event){
        await this.etranslationService.getTranslation(eventTranslation.event, id.toString(), 'event', 'event')
      }
    }
    return this.eventRepository.translations(id).create(eventTranslation);
  }

  @patch('/events/{id}/event-translations', {
    responses: {
      '200': {
        description: 'Event.EventTranslation PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(EventTranslation, { partial: true }),
        },
      },
    })
    eventTranslation: Partial<EventTranslation>,
    @param.query.object('where', getWhereSchemaFor(EventTranslation)) where?: Where<EventTranslation>,
  ): Promise<Count> {
    if(eventTranslation.translated){
      if(eventTranslation.description){
        await this.etranslationService.getTranslation(eventTranslation.description, id.toString(), 'event', 'description')
      }
      await new Promise(r => setTimeout(r, 500));
      if(eventTranslation.event){
        await this.etranslationService.getTranslation(eventTranslation.event, id.toString(), 'event', 'event')
      }
    }
    return this.eventRepository.translations(id).patch(eventTranslation, where);
  }

  @del('/events/{id}/event-translations', {
    responses: {
      '200': {
        description: 'Event.EventTranslation DELETE success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(EventTranslation)) where?: Where<EventTranslation>,
  ): Promise<Count> {
    return this.eventRepository.translations(id).delete(where);
  }
}
