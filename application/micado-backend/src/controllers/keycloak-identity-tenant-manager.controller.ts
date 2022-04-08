// Uncomment these imports to begin using these cool features!
import {inject} from '@loopback/context';
import {get, param, post} from '@loopback/rest';
import {
  KeycloakService
} from '../services/keycloak.service';

//var soap = require('soap');
var request = require('request')
var req = request.defaults({
  strictSSL: false
});

export class KeycloakIdentityTenantManagerController {
  constructor(
    //@repository(TenantRepository) public tenantRepository: TenantRepository,
    @inject('services.Keycloak') protected keycloakService: KeycloakService,
  ) { }


  @post('/createKeycloakUser')
  async createUser(
    @param({name: 'username', in: 'query', required: false}) username: String,
    @param({name: 'realm', in: 'query', required: false}) realm: String,
    @param({name: 'token', in: 'query', required: false}) token: String,
    @param({name: 'baseurl', in: 'query', required: false}) baseurl: String,
  ): Promise<any> {
    //Preconditions
    console.log(username)
    console.log(realm)
    console.log(token)
    return this.keycloakService.createUser(
      username,
      realm,
      token,
      baseurl
    );

  }
  @post('/createKeycloakUserWithRole')
  async createUserWithRole(
    @param({name: 'username', in: 'query', required: false}) username: String,
    @param({name: 'realm', in: 'query', required: false}) realm: String,
    @param({name: 'token', in: 'query', required: false}) token: String,
    @param({name: 'baseurl', in: 'query', required: false}) baseurl: String,
    @param({name: 'role', in: 'query', required: false}) role: String = "",
    @param({name: 'clientId', in: 'query', required: false}) clientId: String = "",
  ): Promise<any> {
    //Preconditions
    await this.createUser(username, realm, token, baseurl)
    var user = await this.keycloakService.getUser(
      baseurl,
      realm,
      username,
      token
    )
    console.log("I am new user")
    console.log(user)
    if (role != "") {
      console.log("inside if")
      console.log(user)
      //var client_id = await this.getClientId(baseurl, realm, clientId, token)
      //console.log(client_id)
      await this.addRole(baseurl, realm, clientId, token, user[0].id, role)
      return user
    }
    else {
      return user
    }
  }
/*
  @post('/createKeycloakUserWithRoleAndGroup')
  async createKeycloakUserWithRoleAndGroup(
    @param({name: 'username', in: 'query', required: false}) username: String,
    @param({name: 'realm', in: 'query', required: false}) realm: String,
    @param({name: 'token', in: 'query', required: false}) token: String,
    @param({name: 'baseurl', in: 'query', required: false}) baseurl: String,
    @param({name: 'role', in: 'query', required: false}) role: String[] = [],
    @param({name: 'clientId', in: 'query', required: false}) clientId: String[]= [],
    @param({name: 'group', in: 'query', required: false}) group: String[] = [],
  ): Promise<any> {
    //Preconditions
    await this.createUser(username, realm, token, baseurl)
    var user = await this.keycloakService.getUser(
      baseurl,
      realm,
      username,
      token
    )
    console.log("I am new user")
    console.log(user)
    if(group.length >0){
      group.forEach((group)=>{
        let groups = this.getGroupId(baseurl, realm, token)
      })
      await this.addToGroup()
    }
    if (role != "") {
      console.log("inside if")
      console.log(user)
      //var client_id = await this.getClientId(baseurl, realm, clientId, token)
      //console.log(client_id)
      await this.addRole(baseurl, realm, clientId, token, user[0].id, role)
      return user
    }
    else {
      return user
    }
  }*/

  @get('/getClientRoles')
  async getClientRoles(
    @param({name: 'baseurl', in: 'query', required: false}) baseurl: String,
    @param({name: 'realm', in: 'query', required: false}) realm: String,
    @param({name: 'clientId', in: 'query', required: false}) clientId: String,
    @param({name: 'token', in: 'query', required: false}) token: String,
  ): Promise<any> {
    //Preconditions
    return this.keycloakService.getClientRoles(
      baseurl,
      realm,
      clientId,
      token
    );

  }
  @get('/getClientId')
  async getClientId(
    @param({name: 'baseurl', in: 'query', required: false}) baseurl: String,
    @param({name: 'realm', in: 'query', required: false}) realm: String,
    @param({name: 'clientId', in: 'query', required: false}) clientId: String,
    @param({name: 'token', in: 'query', required: false}) token: String,
  ): Promise<any> {
    //Preconditions
    return this.keycloakService.getClientId(
      baseurl,
      realm,
      clientId,
      token
    );

  }

  @get('/getGroupId')
  async getGroupId(
    @param({name: 'baseurl', in: 'query', required: false}) baseurl: String,
    @param({name: 'realm', in: 'query', required: false}) realm: String,
    @param({name: 'token', in: 'query', required: false}) token: String,
  ): Promise<any> {
    //Preconditions
    return this.keycloakService.getGroupId(
      baseurl,
      realm,
      token
    );

  }

  @post('/createGroup')
  async addToGroup(
    @param({name: 'userId', in: 'query', required: false}) userId: String,
    @param({name: 'groupId', in: 'query', required: false}) groupId: String,
    @param({name: 'realm', in: 'query', required: false}) realm: String,
    @param({name: 'token', in: 'query', required: false}) token: String,
    @param({name: 'baseurl', in: 'query', required: false}) baseurl: String,
  ): Promise<any> {
    //Preconditions
    return this.keycloakService.addToGroup(
      userId,
      groupId,
      realm,
      token,
      baseurl
    );

  }

  @post('/addToGroup')
  async createGroup(
    @param({name: 'name', in: 'query', required: false}) name: String,
    @param({name: 'realm', in: 'query', required: false}) realm: String,
    @param({name: 'token', in: 'query', required: false}) token: String,
    @param({name: 'baseurl', in: 'query', required: false}) baseurl: String,
  ): Promise<any> {
    //Preconditions
    return this.keycloakService.createGroup(
      name,
      realm,
      token,
      baseurl
    );

  }

  @get('/addRoleToUser')
  async addRole(
    @param({name: 'baseurl', in: 'query', required: false}) baseurl: String,
    @param({name: 'realm', in: 'query', required: false}) realm: String,
    @param({name: 'clientId', in: 'query', required: false}) clientId: String,
    @param({name: 'token', in: 'query', required: false}) token: String,
    @param({name: 'userid', in: 'query', required: false}) userid: String,
    @param({name: 'role', in: 'query', required: false}) role: any,
  ): Promise<any> {
    //Preconditions
    console.log("in adding role")
    console.log("Gettign client id")
    console.log("getting role")

    let roles = await this.keycloakService.getRealmRoles(
      baseurl,
      realm,
      token
    );
    var the_roles = JSON.parse(role)
    console.log("I am roles")
    console.log(roles)
    console.log("I am roles to assign")
    console.log(the_roles)
    the_roles.forEach((rol: any) => {
      var selected_role = roles.filter((role: any) => {
        return role.name == rol
      })[0]
      console.log(selected_role)
      let payload = [{
        id: selected_role.id,
        name: selected_role.name
      }]
      console.log(payload)
      console.log("adding role")
      var url = 'http://' + baseurl + '/auth/admin/realms/' + realm + '/users/' + userid + '/role-mappings/realm'
      console.log(url)
      const axios = require('axios').default;
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
      axios({
        url: url,
        method: "post",
        data: payload
      }
      )

      /*console.log(this.keycloakService.addRole(
        baseurl,
        realm,
        userid,
        token,
        payload
      ))*/

    })
  }

}
