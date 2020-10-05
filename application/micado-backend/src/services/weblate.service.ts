import { getService } from '@loopback/service-proxy';
import { inject, Provider } from '@loopback/core';
import { WeblateDataSource } from '../datasources';



export interface WeblateService {
  // this is where you define the Node.js methods that will be
  // mapped to REST/SOAP/gRPC operations as stated in the datasource
  // json file.
  translations (): Promise<any>;
}

export class WeblateProvider implements Provider<WeblateService> {
  constructor(
    // identityserver must match the name property in the datasource json file
    @inject('datasources.weblate')
    protected dataSource: WeblateDataSource = new WeblateDataSource(),
  ) { }

  value (): Promise<WeblateService> {
    return getService(this.dataSource);
  }
}


