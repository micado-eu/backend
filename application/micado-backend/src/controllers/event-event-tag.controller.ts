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
    EventTag,
} from '../models';
import { EventRepository, EventTagRepository } from '../repositories';

export class EventEventTagController {
    constructor(
        @repository(EventRepository) protected eventRepository: EventRepository,
        @repository(EventTagRepository) protected eventTagRepository: EventTagRepository,
    ) { }

    @get('/events/{id}/event-tags', {
        responses: {
            '200': {
                description: 'Array of Event has many EventTag',
                content: {
                    'application/json': {
                        schema: { type: 'array', items: getModelSchemaRef(EventTag) },
                    },
                },
            },
        },
    })
    async find(
        @param.path.number('id') id: number,
        @param.query.object('filter') filter?: Filter<EventTag>,
    ): Promise<EventTag[]> {
        return this.eventRepository.tags(id).find(filter);
    }

    @post('/events/{id}/event-tags', {
        responses: {
            '200': {
                description: 'Event model instance',
                content: { 'application/json': { schema: getModelSchemaRef(EventTag) } },
            },
        },
    })
    async create(
        @param.path.number('id') id: typeof Event.prototype.id,
        @requestBody({
            content: {
                'application/json': {
                    schema: getModelSchemaRef(EventTag, {
                        title: 'NewEventTagInEvent',
                        //           exclude: ['id'],
                        optional: ['id']
                    }),
                },
            },
        }) eventTranslation: EventTag,
        //    }) eventTranslation: Omit < EventTag, 'id' >,
    ): Promise<EventTag> {
        return this.eventRepository.tags(id).create(eventTranslation);
    }

    @patch('/events/{id}/event-tags', {
        responses: {
            '200': {
                description: 'Event.EventTag PATCH success count',
                content: { 'application/json': { schema: CountSchema } },
            },
        },
    })
    async patch(
        @param.path.number('id') id: number,
        @requestBody({
            content: {
                'application/json': {
                    schema: getModelSchemaRef(EventTag, { partial: true }),
                },
            },
        })
        eventTranslation: Partial<EventTag>,
        @param.query.object('where', getWhereSchemaFor(EventTag)) where?: Where<EventTag>,
    ): Promise<Count> {
        return this.eventRepository.tags(id).patch(eventTranslation, where);
    }

    @del('/events/{id}/event-tags', {
        responses: {
            '200': {
                description: 'Event.EventTag DELETE success count',
                content: { 'application/json': { schema: CountSchema } },
            },
        },
    })
    async delete(
        @param.path.number('id') id: number,
        @param.query.object('where', getWhereSchemaFor(EventTag)) where?: Where<EventTag>,
    ): Promise<Count> {
        let tags = await this.eventRepository.tags(id).find()
        for (let tag of tags) {
            await this.eventTagRepository.translations(tag.id).delete()
        }
        return this.eventRepository.tags(id).delete(where);
    }
}
