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
  Information,
  InformationTranslation,
} from '../models';
import { InformationRepository } from '../repositories';
import { MarkdownConverterService } from '../services/markdown-converter.service';
import {authenticate} from '@loopback/authentication';

import {EtranslationService} from '../services/etranslation.service'

@authenticate('micado')
export class InformationInformationTranslationController {
  constructor(
    @repository(InformationRepository) protected informationRepository: InformationRepository,
    @service() public etranslationService: EtranslationService,

  ) { }

  @get('/information/{id}/information-translations', {
    responses: {
      '200': {
        description: 'Array of Information has many InformationTranslation',
        content: {
          'application/json': {
            schema: { type: 'array', items: getModelSchemaRef(InformationTranslation) },
          },
        },
      },
    },
  })
  async find(
    @param.path.number('id') id: number,
    @param.query.object('filter') filter?: Filter<InformationTranslation>,
  ): Promise<InformationTranslation[]> {
    return this.informationRepository.translations(id).find(filter)
  }

  @post('/information/{id}/information-translations', {
    responses: {
      '200': {
        description: 'Information model instance',
        content: { 'application/json': { schema: getModelSchemaRef(InformationTranslation) } },
      },
    },
  })
  async create(
    @param.path.number('id') id: typeof Information.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(InformationTranslation, {
            title: 'NewInformationTranslationInInformation',
            //           exclude: ['id'],
            optional: ['id']
          }),
        },
      },
    }) informationTranslation: InformationTranslation,
    //    }) informationTranslation: Omit < InformationTranslation, 'id' >,
  ): Promise<InformationTranslation> {
    if(informationTranslation.translated){
      if(informationTranslation.description){
        await this.etranslationService.getTranslation(informationTranslation.description, informationTranslation.id.toString(), 'information', 'description')
      }
      await new Promise(r => setTimeout(r, 500));
      if(informationTranslation.information){
        await this.etranslationService.getTranslation(informationTranslation.information, informationTranslation.id.toString(), 'information', 'information')
      }
    }
    return this.informationRepository.translations(id).create(informationTranslation);
  }

  @patch('/information/{id}/information-translations', {
    responses: {
      '200': {
        description: 'Information.InformationTranslation PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async patch(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(InformationTranslation, { partial: true }),
        },
      },
    })
    informationTranslation: Partial<InformationTranslation>,
    @param.query.object('where', getWhereSchemaFor(InformationTranslation)) where?: Where<InformationTranslation>,
  ): Promise<Count> {
    if(informationTranslation.translated){
      if(informationTranslation.description){
        await this.etranslationService.getTranslation(informationTranslation.description, id.toString(), 'information', 'description')
      }
      await new Promise(r => setTimeout(r, 500));
      if(informationTranslation.information){
        await this.etranslationService.getTranslation(informationTranslation.information, id.toString(), 'information', 'information')
      }
    }
    return this.informationRepository.translations(id).patch(informationTranslation, where);
  }

  @del('/information/{id}/information-translations', {
    responses: {
      '200': {
        description: 'Information.InformationTranslation DELETE success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async delete(
    @param.path.number('id') id: number,
    @param.query.object('where', getWhereSchemaFor(InformationTranslation)) where?: Where<InformationTranslation>,
  ): Promise<Count> {
    return this.informationRepository.translations(id).delete(where);
  }
}
