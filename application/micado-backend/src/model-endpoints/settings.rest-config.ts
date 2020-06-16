import {ModelCrudRestApiConfig} from '@loopback/rest-crud';
import {Settings} from '../models';

const config: ModelCrudRestApiConfig = {
  model: Settings,
  pattern: 'CrudRest',
  dataSource: 'micadoDS',
  basePath: '/settings',
};
module.exports = config;
