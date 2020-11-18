// Uncomment these imports to begin using these cool features!
import { get, post, param, HttpErrors } from '@loopback/rest';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import { TenantRepository } from '../repositories';
import { Tenant } from '../models';

// import {inject} from '@loopback/context';
var soap = require('soap');
var request = require('request')

var req = request.defaults({
  strictSSL: false
});

export class IdentityTenantManagerController {
  constructor(
    @repository(TenantRepository) public tenantRepository: TenantRepository,

  ) { }


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
    var options = {
      request: req,
      wsdl_options: {
        forever: true,
        rejectUnauthorized: false,
        strictSSL: false
      },
      endpoint: 'https://' + process.env.IDENTITY_HOSTNAME + innerPort + '/services/TenantMgtAdminService.TenantMgtAdminServiceHttpsEndpoint/'
    }
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
    var options = {
      request: req,
      wsdl_options: {
        forever: true,
        rejectUnauthorized: false,
        strictSSL: false
      },
      endpoint: 'https://' + process.env.IDENTITY_HOSTNAME + innerPort + '/services/TenantMgtAdminService.TenantMgtAdminServiceHttpsEndpoint/'
    }
    var tenantInfo = null
    return new Promise((resolve, reject) => {
      soap.createClient(url, options, function (err: any, client: any) {
        client.setSecurity(new soap.BasicAuthSecurity(process.env.WSO2_IDENTITY_ADMIN_USER, process.env.WSO2_IDENTITY_ADMIN_PWD));
        console.log(JSON.stringify(client.describe()))

        client.retrieveTenants(args, function (err: any, result: any) {
          //     client.getTenant(args, function (err: any, result: any) {
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
    var options = {
      request: req,
      wsdl_options: {
        forever: true,
        rejectUnauthorized: false,
        strictSSL: false
      },
      endpoint: 'https://' + process.env.IDENTITY_HOSTNAME + innerPort + '/services/TenantMgtAdminService.TenantMgtAdminServiceHttpsEndpoint/'
    }
    var tenantInfo = null
    return new Promise((resolve, reject) => {
      soap.createClient(url, options, function (err: any, client: any) {
        client.setSecurity(new soap.BasicAuthSecurity(process.env.WSO2_IDENTITY_ADMIN_USER, process.env.WSO2_IDENTITY_ADMIN_PWD));
        console.log(JSON.stringify(client.describe()))
        client.addTenant(args, function (err: any, result: any) {
          console.log(result);
          console.log(err)
          result.tenantInfoBean = args.tenantInfoBean
          return resolve(result)
        });
      });
    })
  }

  @post('/addTenantPlusDB')
  async addTenantPlusDB (
    @param.query.string('tenant') tenantDomain: String,
    @param.query.string('password') password: String,
    @param.query.string('email') email: String,
    @param.query.string('firstname') firstname: String,
    @param.query.string('lastname') lastname: String,
    @param.query.string('tenantname') tenantname: string,
    @param.query.string('link') link: string,
    @param.query.string('address') address: string,
    @param.query.string('contactmail') contactmail: string,
  ): Promise<any> {

    let isRet = await this.addTenant(tenantDomain, password, email, firstname, lastname)
    console.log(isRet)
    let dbTenant: Tenant = new Tenant({
      id: isRet.tenantInfoBean.tenantId,
      name: tenantname,
      link: link,
      email: contactmail,
      address: address
    })
    return this.tenantRepository.create(dbTenant);
  }
}
