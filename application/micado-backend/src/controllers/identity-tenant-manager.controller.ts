// Uncomment these imports to begin using these cool features!
import { get, post, param, HttpErrors } from '@loopback/rest';

// import {inject} from '@loopback/context';
var soap = require('soap');

export class IdentityTenantManagerController {
  constructor() { }


  @get('/getTenant1/{tenant}')
  async getTenant (
    @param.path.string('tenant') tenantDomain: String,
  ): Promise<any> {
    //Preconditions
    console.log("in the identity controller")
    console.log(tenantDomain)
    var url = '/code/micado-backend/src/datasources/TenantMgtAdminService.xml';
    var args = { tenantDomain: tenantDomain };
    var tenantInfo = null
    return new Promise((resolve, reject) => {
      soap.createClient(url, function (err: any, client: any) {
        client.setSecurity(new soap.BasicAuthSecurity('admin', 'micadoadm2020'));
        console.log(JSON.stringify(client.describe()))
        client.getTenant(args, function (err: any, result: any) {
          console.log(result);
          return resolve(result)
        });
      });
    })
  }


  @post('/addTenant1/{tenant}')
  async addTenant1 (
    @param.path.string('tenant') tenantDomain: String,
    @param.path.string('tenant') password: String,
  ): Promise<any> {
    //Preconditions
    console.log("in the identity controller")
    console.log(tenantDomain)
    var url = '/code/micado-backend/src/datasources/TenantMgtAdminService.xml';
    var args = {
      tenantInfoBean: {
        active: true,
        admin: "admin",
        adminPassword: password,
        createdDate: null,
        email: "xs:string",
        firstname: "xs:string",
        lastname: "xs:string",
        originatedService: null,
        successKey: null,
        tenantDomain: "xs:string",
        tenantId: null,
        usagePlan: null
      }
    };
    var tenantInfo = null
    return new Promise((resolve, reject) => {
      soap.createClient(url, function (err: any, client: any) {
        client.setSecurity(new soap.BasicAuthSecurity('admin', 'micadoadm2020'));
        console.log(JSON.stringify(client.describe()))
        client.getTenant(args, function (err: any, result: any) {
          console.log(result);
          return resolve(result)
        });
      });
    })
  }
}
