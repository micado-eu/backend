import {ModelCrudRestApiConfig} from '@loopback/rest-crud';
import {Glossary} from '../models';

const config: ModelCrudRestApiConfig = {
  model: Glossary,
  pattern: 'CrudRest',
  dataSource: 'micadoDS',
  basePath: '/glossaries',
};
module.exports = config;
