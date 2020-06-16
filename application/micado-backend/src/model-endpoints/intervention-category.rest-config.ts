import {ModelCrudRestApiConfig} from '@loopback/rest-crud';
import {InterventionCategory} from '../models';

const config: ModelCrudRestApiConfig = {
  model: InterventionCategory,
  pattern: 'CrudRest',
  dataSource: 'micadoDS',
  basePath: '/intervention-categories',
};
module.exports = config;
