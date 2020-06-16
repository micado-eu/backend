import {ModelCrudRestApiConfig} from '@loopback/rest-crud';
import {DocumentTypeTranslation} from '../models';

const config: ModelCrudRestApiConfig = {
  model: DocumentTypeTranslation,
  pattern: 'CrudRest',
  dataSource: 'micadoDS',
  basePath: '/document-type-translations',
};
module.exports = config;
