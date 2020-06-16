import {ModelCrudRestApiConfig} from '@loopback/rest-crud';
import {Languages} from '../models';

const config: ModelCrudRestApiConfig = {
  model: Languages,
  pattern: 'CrudRest',
  dataSource: 'micadoDS',
  basePath: '/languages',
};
module.exports = config;
