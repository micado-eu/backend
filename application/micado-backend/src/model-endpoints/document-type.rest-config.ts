import {ModelCrudRestApiConfig} from '@loopback/rest-crud';
import {DocumentType} from '../models';

const config: ModelCrudRestApiConfig = {
  model: DocumentType,
  pattern: 'CrudRest',
  dataSource: 'micadoDS',
  basePath: '/document-types',
};
module.exports = config;
