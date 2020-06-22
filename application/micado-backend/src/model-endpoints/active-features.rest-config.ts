import {ModelCrudRestApiConfig} from '@loopback/rest-crud';
import {ActiveFeatures} from '../models';

const config: ModelCrudRestApiConfig = {
  model: ActiveFeatures,
  pattern: 'CrudRest',
  dataSource: 'micadoDS',
  basePath: '/active-features',
};
module.exports = config;
