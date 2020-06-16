import {ModelCrudRestApiConfig} from '@loopback/rest-crud';
import {InterventionTypes} from '../models';

const config: ModelCrudRestApiConfig = {
  model: InterventionTypes,
  pattern: 'CrudRest',
  dataSource: 'micadoDS',
  basePath: '/intervention-types',
};
module.exports = config;
