import {ModelCrudRestApiConfig} from '@loopback/rest-crud';
import {Topic} from '../models';

const config: ModelCrudRestApiConfig = {
  model: Topic,
  pattern: 'CrudRest',
  dataSource: 'micadoDS',
  basePath: '/topics',
};
module.exports = config;
