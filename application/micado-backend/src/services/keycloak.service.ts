import {inject, Provider} from '@loopback/core';
import {getService} from '@loopback/service-proxy';
import {KeycloakDataSource} from '../datasources';


export interface KeycloakService {
  // this is where you define the Node.js methods that will be
  // mapped to REST/SOAP/gRPC operations as stated in the datasource
  // json file.

  createUser(username: String, firstName: String, lastName:String, email: String, password:String, birthdate:String, nationality: String, gender: String, phone_number:String, realm: String, token: String, baseurl: String): Promise<any>;
  createUserWithGroup(username: String, firstName: String, lastName:String, email: String, password:String, group:string[], birthdate:String, nationality: String, gender: String, phone_number:String, realm: String, token: String, baseurl: String): Promise<any>;
  getUser(id:String, realm: String, token: String, baseurl: String): Promise<any>;
  getUserList(realm: String, token: String, baseurl: String): Promise<any>;
  getGroupList(realm: String, token: String, baseurl: String): Promise<any>;
  getClientRoles(baseurl: String, realm: String, clientId: String, token: String): Promise<any>;
  getRealmRoles(baseurl: String, realm: String, token: String): Promise<any>;
  getRoleId(baseurl: String, realm: String, clientId: String, roleName:String, token: String): Promise<any>;
  getClientId(baseurl: String, realm: String, clientId: String, token: String): Promise<any>;
  addRole(baseurl: String, realm: String, userid: String, token: String, paylod:any): Promise<any>;
  getUser(baseurl: String, realm: String, username: String, token: String): Promise<any>;
  createGroup(name: String, realm: String, token: String, baseurl:String): Promise<any>;
  addToGroup(userId: String, groupId: String, realm: String, token: String, baseurl:String): Promise<any>;
  getGroupId(baseurl: String, realm: String, token: String): Promise<any>;
  getManager(baseurl: String,payload:any): Promise<any>;
  getGroupMembers(baseurl: String,realm: String, groupId:String, token:String): Promise<any>;
  updateUser(userid:String, firstName: String, lastName:String, email: String, birthdate:String, nationality: String, gender: String, phone_number:String, realm: String, token: String, baseurl: String): Promise<any>;
  updateUserPassword(userid:String, password:String, realm: String, token: String, baseurl: String): Promise<any>;


}

export class KeycloakProvider implements Provider<KeycloakService> {
  constructor(
    // identityserver must match the name property in the datasource json file
    @inject('datasources.keycloak')
    protected dataSource: KeycloakDataSource = new KeycloakDataSource(),
  ) { }

  value(): Promise<KeycloakService> {
    return getService(this.dataSource);
  }
}


