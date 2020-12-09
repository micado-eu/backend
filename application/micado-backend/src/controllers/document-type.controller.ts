import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import { DocumentType } from '../models';
import { DocumentTypeRepository } from '../repositories';
import { JSONArray } from '@loopback/core';

export class DocumentTypeController {
  constructor(
    @repository(DocumentTypeRepository)
    public documentTypeRepository: DocumentTypeRepository,
  ) { }

  @post('/document-types', {
    responses: {
      '200': {
        description: 'DocumentType model instance',
        content: { 'application/json': { schema: getModelSchemaRef(DocumentType) } },
      },
    },
  })
  async create (
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DocumentType, {
            title: 'NewDocumentType',
            exclude: ['id'],
          }),
        },
      },
    })
    documentType: Omit<DocumentType, 'id'>,
  ): Promise<DocumentType> {
    return this.documentTypeRepository.create(documentType);
  }

  @get('/document-types/count', {
    responses: {
      '200': {
        description: 'DocumentType model count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async count (
    @param.where(DocumentType) where?: Where<DocumentType>,
  ): Promise<Count> {
    return this.documentTypeRepository.count(where);
  }

  @get('/document-types', {
    responses: {
      '200': {
        description: 'Array of DocumentType model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(DocumentType, { includeRelations: true }),
            },
          },
        },
      },
    },
  })
  async find (
    @param.filter(DocumentType) filter?: Filter<DocumentType>,
  ): Promise<DocumentType[]> {
    return this.documentTypeRepository.find(filter);
  }

  @patch('/document-types', {
    responses: {
      '200': {
        description: 'DocumentType PATCH success count',
        content: { 'application/json': { schema: CountSchema } },
      },
    },
  })
  async updateAll (
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DocumentType, { partial: true }),
        },
      },
    })
    documentType: DocumentType,
    @param.where(DocumentType) where?: Where<DocumentType>,
  ): Promise<Count> {
    return this.documentTypeRepository.updateAll(documentType, where);
  }

  @get('/document-types/{id}', {
    responses: {
      '200': {
        description: 'DocumentType model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(DocumentType, { includeRelations: true }),
          },
        },
      },
    },
  })
  async findById (
    @param.path.number('id') id: number,
    @param.filter(DocumentType, { exclude: 'where' }) filter?: FilterExcludingWhere<DocumentType>
  ): Promise<DocumentType> {
    return this.documentTypeRepository.findById(id, filter);
  }

  @patch('/document-types/{id}', {
    responses: {
      '204': {
        description: 'DocumentType PATCH success',
      },
    },
  })
  async updateById (
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(DocumentType, { partial: true }),
        },
      },
    })
    documentType: DocumentType,
  ): Promise<void> {
    await this.documentTypeRepository.updateById(id, documentType);
  }

  @put('/document-types/{id}', {
    responses: {
      '204': {
        description: 'DocumentType PUT success',
      },
    },
  })
  async replaceById (
    @param.path.number('id') id: number,
    @requestBody() documentType: DocumentType,
  ): Promise<void> {
    await this.documentTypeRepository.replaceById(id, documentType);
  }

  @del('/document-types/{id}', {
    responses: {
      '204': {
        description: 'DocumentType DELETE success',
      },
    },
  })
  async deleteById (@param.path.number('id') id: number): Promise<void> {
    await this.documentTypeRepository.deleteById(id);
  }

  @get('/document-types-migrant', {
    responses: {
      '200': {
        description: 'document-types GET for the frontend',
      },
    },
  })
  async translatedunion (
    @param.query.string('defaultlang') defaultlang = 'en',
    @param.query.string('currentlang') currentlang = 'en'
  ): Promise<void> {
    return this.documentTypeRepository.dataSource.execute("select * from document_type t inner join document_type_translation tt on t.id=tt.id and tt.lang='" +
      currentlang + "' union select * from document_type t inner join document_type_translation tt on t.id = tt.id and tt.lang = '" +
      defaultlang +
      "' and t.id not in (select t.id from document_type t inner join document_type_translation tt on t.id = tt.id and tt.lang = '" +
      currentlang + "')");
  }

  @get('/document-types-rasa', {
    responses: {
      '200': {
        description: 'document-types GET for the frontend',
      },
    },
  })
  async translatedunion_x_rasa (
    @param.query.string('defaultlang') defaultlang = 'en',
    @param.query.string('currentlang') currentlang = 'en'
  ): Promise<JSONArray> {
    let arrRet: JSONArray = []
    await this.documentTypeRepository.dataSource.execute("select document from document_type t inner join document_type_translation tt on t.id=tt.id and tt.lang='" +
      currentlang + "' union select document from document_type t inner join document_type_translation tt on t.id = tt.id and tt.lang = '" +
      defaultlang +
      "' and t.id not in (select t.id from document_type t inner join document_type_translation tt on t.id = tt.id and tt.lang = '" +
      currentlang + "')")
      .then(documents => {
        console.log(documents)
        documents.forEach((doc: any) => {
          arrRet.push(doc.document)
        });
        //      arrRet = documents
        //     return arrRet
      })
    return arrRet
  }

  @get('/document-types/to-production', {
    responses: {
      '200': {
        description: 'process GET for the frontend',
      },
    },
  })
  async publish (
    @param.query.number('id') id:number,
  ): Promise<void> {
    return this.documentTypeRepository.dataSource.execute("insert into document_type_translation_prod(id, lang ,document,description,translation_date) select document_type_translation.id, document_type_translation.lang, document_type_translation.document, document_type_translation.description, document_type_translation.translation_date from document_type_translation  where "+'"translationState"'+" >= '2' and id=" + id);
  }
}
