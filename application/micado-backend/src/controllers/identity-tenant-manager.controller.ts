// Uncomment these imports to begin using these cool features!
import { get, post, param, HttpErrors } from '@loopback/rest';

// import {inject} from '@loopback/context';
var soap = require('soap');

export class IdentityTenantManagerController {
  constructor() { }


  @get('/getTenant/{tenant}')
  async getTenant (
    @param.path.string('tenant') tenantDomain: String,
  ): Promise<any> {
    //Preconditions
    console.log("in the identity controller")
    console.log(tenantDomain)
    var innerPort = (process.env.MICADO_ENV != undefined && process.env.MICADO_ENV.localeCompare("dev") == 0 ? "" : ":9443")
    var url = 'https://' + process.env.IDENTITY_HOSTNAME + innerPort + '/services/TenantMgtAdminService?wsdl'
    var args = { tenantDomain: tenantDomain };
    var options = { endpoint: 'https://' + process.env.IDENTITY_HOSTNAME + innerPort + '/services/TenantMgtAdminService.TenantMgtAdminServiceHttpsEndpoint/' }
    var tenantInfo = null
    return new Promise((resolve, reject) => {
      soap.createClient(url, options, function (err: any, client: any) {
        client.setSecurity(new soap.BasicAuthSecurity(process.env.WSO2_IDENTITY_ADMIN_USER, process.env.WSO2_IDENTITY_ADMIN_PWD));
        console.log(JSON.stringify(client.describe()))
        client.getTenant(args, function (err: any, result: any) {
          console.log(result);
          return resolve(result)
        });
      });
    })
  }

  @get('/getTenant')
  async retrieveTenants (
  ): Promise<any> {
    //Preconditions
    console.log("in the identity controller retrieveTenants")
    //    var url = '/code/micado-backend/src/datasources/TenantMgtAdminService.xml';

    var innerPort = (process.env.MICADO_ENV != undefined && process.env.MICADO_ENV.localeCompare("dev") == 0 ? "" : ":9443")
    console.log(process.env.MICADO_ENV)
    console.log(innerPort)
    var url = 'https://' + process.env.IDENTITY_HOSTNAME + innerPort + '/services/TenantMgtAdminService?wsdl'
    console.log(url)
    var args = {};
    var options = { endpoint: 'https://' + process.env.IDENTITY_HOSTNAME + innerPort + '/services/TenantMgtAdminService.TenantMgtAdminServiceHttpsEndpoint/' }
    var tenantInfo = null
    return new Promise((resolve, reject) => {
      soap.createClient(url, options, function (err: any, client: any) {
        client.setSecurity(new soap.BasicAuthSecurity(process.env.WSO2_IDENTITY_ADMIN_USER, process.env.WSO2_IDENTITY_ADMIN_PWD));
        console.log(JSON.stringify(client.describe()))
        client.retrieveTenants(args, function (err: any, result: any) {
          console.log(result);
          return resolve(result)
        });
      });
    })
  }

  @post('/addTenant')
  async addTenant (
    @param.query.string('tenant') tenantDomain: String,
    @param.query.string('password') password: String,
    @param.query.string('email') email: String,
    @param.query.string('firstname') firstname: String,
    @param.query.string('lastname') lastname: String,
  ): Promise<any> {
    //Preconditions
    console.log("in the identity controller")
    console.log(tenantDomain)
    var innerPort = (process.env.MICADO_ENV != undefined && process.env.MICADO_ENV.localeCompare("dev") == 0 ? "" : ":9443")
    var url = 'https://' + process.env.IDENTITY_HOSTNAME + innerPort + '/services/TenantMgtAdminService?wsdl'
    let tenants = await this.retrieveTenants()
    console.log(tenants)
    let maxTenant = tenants.retrieveTenantsResponse.return.sort(
      function (a: any, b: any) {
        return b['tenantId'] - a['tenantId'];
      }
    )[0]['tenantId']
    console.log(maxTenant)
    maxTenant++
    var args = {
      tenantInfoBean: {
        active: true,
        admin: "admin",
        adminPassword: password,
        createdDate: '',
        email: email,
        firstname: firstname,
        lastname: lastname,
        originatedService: '',
        successKey: '',
        tenantDomain: tenantDomain,
        tenantId: maxTenant,
        usagePlan: ''
      }
    };
    var options = { endpoint: 'https://' + process.env.IDENTITY_HOSTNAME + innerPort + '/services/TenantMgtAdminService.TenantMgtAdminServiceHttpsEndpoint/' }
    var tenantInfo = null
    return new Promise((resolve, reject) => {
      soap.createClient(url, options, function (err: any, client: any) {
        client.setSecurity(new soap.BasicAuthSecurity(process.env.WSO2_IDENTITY_ADMIN_USER, process.env.WSO2_IDENTITY_ADMIN_PWD));
        console.log(JSON.stringify(client.describe()))
        client.addTenant(args, function (err: any, result: any) {
          console.log(result);
          console.log(err)
          return resolve(result)
        });
      });
    })
  }
}
