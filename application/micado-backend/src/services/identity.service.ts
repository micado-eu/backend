import { getService } from '@loopback/service-proxy';
import { inject, Provider } from '@loopback/core';
import { IdentityserverDataSource } from '../datasources';



export interface IdentityService {
  // this is where you define the Node.js methods that will be
  // mapped to REST/SOAP/gRPC operations as stated in the datasource
  // json file.
  consent (tenant: String, principal: String, auth: String, baseurl: String): Promise<String>;
  receipt (receipt: String, auth: String, baseurl: String): Promise<any>;
}

export class IdentityProvider implements Provider<IdentityService> {
  constructor(
    // identityserver must match the name property in the datasource json file
    @inject('datasources.identityserver')
    protected dataSource: IdentityserverDataSource = new IdentityserverDataSource(),
  ) { }

  value (): Promise<IdentityService> {
    return getService(this.dataSource);
  }
}


