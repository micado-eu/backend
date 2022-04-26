// Uncomment these imports to begin using these cool features!
import {inject} from '@loopback/context';
import {get, param, post} from '@loopback/rest';
import {
  KeycloakService
} from '../services/keycloak.service';


export class KeycloakIdentityTenantManagerController {
  constructor(
    //@repository(TenantRepository) public tenantRepository: TenantRepository,
    @inject('services.Keycloak') protected keycloakService: KeycloakService,
  ) { }


  @post('/createKeycloakUser')
  async createUser(
    @param({name: 'username', in: 'query', required: false}) username: string,
    @param({name: 'realm', in: 'query', required: false}) realm: string,
    @param({name: 'token', in: 'query', required: false}) token: string,
    @param({name: 'baseurl', in: 'query', required: false}) baseurl = (process.env.IDENTITY_HOSTNAME != null ? process.env.IDENTITY_HOSTNAME : ''),
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
    @param({name: 'username', in: 'query', required: false}) username: string,
    @param({name: 'realm', in: 'query', required: false}) realm: string,
    @param({name: 'token', in: 'query', required: false}) token: string,
    @param({name: 'baseurl', in: 'query', required: false})  baseurl = (process.env.IDENTITY_HOSTNAME != null ? process.env.IDENTITY_HOSTNAME : ''),
    @param({name: 'role', in: 'query', required: false}) role: string,
  ): Promise<any> {
    //Preconditions
    await this.createUser(username, realm, token, baseurl)
    const user = await this.keycloakService.getUser(
      baseurl,
      realm,
      username,
      token
    )
    console.log("I am new user")
    console.log(user)
    if (role.length > 0) {
      console.log("inside if")
      console.log(user)
      await this.addRole(baseurl, realm,  token, user[0].id, role)
      return user
    }
    else {
      return user
    }
  }

  @post('/createKeycloakUserWithRoleAndGroup')
  async createKeycloakUserWithRoleAndGroup(
    @param({name: 'username', in: 'query', required: false}) username: string,
    @param({name: 'realm', in: 'query', required: false}) realm: string,
    @param({name: 'token', in: 'query', required: false}) token: string,
    @param({name: 'baseurl', in: 'query', required: false}) baseurl = (process.env.IDENTITY_HOSTNAME != null ? process.env.IDENTITY_HOSTNAME : ''),
    @param({name: 'role', in: 'query', required: false}) role: string,
    @param({name: 'group', in: 'query', required: false}) group: string,
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
    await this.addToGroup(user[0].id, group, realm, token, baseurl)
    let roles_array = JSON.parse(role)
    if (roles_array.length > 0) {
      console.log("inside if")
      console.log(user)
      await this.addRole(baseurl, realm, token, user[0].id, roles_array)
      return user
    }
    else {
      return user
    }
  }

  @get('/getClientRoles')
  async getClientRoles(
    @param({name: 'baseurl', in: 'query', required: false})  baseurl = (process.env.IDENTITY_HOSTNAME != null ? process.env.IDENTITY_HOSTNAME : ''),
    @param({name: 'realm', in: 'query', required: false}) realm: string,
    @param({name: 'clientId', in: 'query', required: false}) clientId: string,
    @param({name: 'token', in: 'query', required: false}) token: string,
  ): Promise<any> {
    //Preconditions
    return this.keycloakService.getClientRoles(
      baseurl,
      realm,
      clientId,
      token
    );

  }

  @get('/getUser')
  async getUser(
    @param({name: 'baseurl', in: 'query', required: false})  baseurl = (process.env.IDENTITY_HOSTNAME != null ? process.env.IDENTITY_HOSTNAME : ''),
    @param({name: 'realm', in: 'query', required: false}) realm: string,
    @param({name: 'id', in: 'query', required: false}) id: string,
    @param({name: 'token', in: 'query', required: false}) token: string,
  ): Promise<any> {
    //Preconditions
    return this.keycloakService.getUser(
      baseurl,
      realm,
      id,
      token
    );
  }

  @get('/getUserList')
  async getUserList(
    @param({name: 'baseurl', in: 'query', required: false})  baseurl = (process.env.IDENTITY_HOSTNAME != null ? process.env.IDENTITY_HOSTNAME : ''),
    @param({name: 'realm', in: 'query', required: false}) realm: string,
    @param({name: 'token', in: 'query', required: false}) token: string,
  ): Promise<any> {
    //Preconditions
    return this.keycloakService.getUserList(
      baseurl,
      realm,
      token
    );
  }

  @get('/getGroupList')
  async getGroupList(
    @param({name: 'baseurl', in: 'query', required: false})  baseurl = (process.env.IDENTITY_HOSTNAME != null ? process.env.IDENTITY_HOSTNAME : ''),
    @param({name: 'realm', in: 'query', required: false}) realm: string,
    @param({name: 'token', in: 'query', required: false}) token: string,
  ): Promise<any> {
    return this.keycloakService.getGroupList(
      baseurl,
      realm,
      token
    );
  }

  @get('/getClientId')
  async getClientId(
    @param({name: 'baseurl', in: 'query', required: false})  baseurl = (process.env.IDENTITY_HOSTNAME != null ? process.env.IDENTITY_HOSTNAME : ''),
    @param({name: 'realm', in: 'query', required: false}) realm: string,
    @param({name: 'clientId', in: 'query', required: false}) clientId: string,
    @param({name: 'token', in: 'query', required: false}) token: string,
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
    @param({name: 'baseurl', in: 'query', required: false})  baseurl = (process.env.IDENTITY_HOSTNAME != null ? process.env.IDENTITY_HOSTNAME : ''),
    @param({name: 'realm', in: 'query', required: false}) realm: string,
    @param({name: 'token', in: 'query', required: false}) token: string,
  ): Promise<any> {
    //Preconditions
    return this.keycloakService.getGroupId(
      baseurl,
      realm,
      token
    );

  }

  @post('/addToGroup')
  async addToGroup(
    @param({name: 'userId', in: 'query', required: false}) userId: string,
    @param({name: 'groupId', in: 'query', required: false}) groupId: string,
    @param({name: 'realm', in: 'query', required: false}) realm: string,
    @param({name: 'token', in: 'query', required: false}) token: string,
    @param({name: 'baseurl', in: 'query', required: false})  baseurl = (process.env.IDENTITY_HOSTNAME != null ? process.env.IDENTITY_HOSTNAME : ''),
  ): Promise<any> {
    //Preconditions
    let groups = await this.getGroupList(baseurl, realm, token)
    let groupStringId = groups.filter((group:any)=>{
      return group.name == groupId
    })[0].id
    console.log(groupStringId)
    return this.keycloakService.addToGroup(
      userId,
      groupStringId,
      realm,
      token,
      baseurl
    );

  }

  @post('/createGroup')
  async createGroup(
    @param({name: 'name', in: 'query', required: false}) name: string,
    @param({name: 'realm', in: 'query', required: false}) realm: string,
    @param({name: 'token', in: 'query', required: false}) token: string,
    @param({name: 'baseurl', in: 'query', required: false})  baseurl = (process.env.IDENTITY_HOSTNAME != null ? process.env.IDENTITY_HOSTNAME : ''),
  ): Promise<any> {
    //Preconditions
    /*const axios = require('axios').default;
    const url = 'http://' + baseurl + '/auth/admin/realms/' + realm + '/groups'
    axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    axios({
      url: url,
      method: "post",
      data: {
        name: name, // This is the body part
      }
    }
    ).then((user:any)=>{
      console.log(user)
    })*/
    return this.keycloakService.createGroup(
      name,
      realm,
      token,
      baseurl
    );

  }

  @post('/addRoleToUser')
  async addRole(
    @param({name: 'baseurl', in: 'query', required: false})  baseurl = (process.env.IDENTITY_HOSTNAME != null ? process.env.IDENTITY_HOSTNAME : ''),
    @param({name: 'realm', in: 'query', required: false}) realm: string,
    @param({name: 'token', in: 'query', required: false}) token: string,
    @param({name: 'userid', in: 'query', required: false}) userid: string,
    @param({name: 'role', in: 'query', required: false}) role: any,
  ): Promise<any> {
    //Preconditions
    console.log("in adding role")
    console.log("Gettign client id")
    console.log("getting role")

    const roles = await this.keycloakService.getRealmRoles(
      baseurl,
      realm,
      token
    );
    const the_roles = role
    console.log("I am roles")
    console.log(roles)
    console.log("I am roles to assign")
    console.log(the_roles)
    the_roles.forEach((rol: any) => {
      const selected_role = roles.filter((role: any) => {
        return role.name == rol
      })[0]
      console.log(selected_role)
      const payload = JSON.stringify([selected_role])
      console.log("I A PAYLOAD")
      console.log(payload)
      console.log("adding role")
      const url = 'https://' + baseurl + '/auth/admin/realms/' + realm + '/users/' + userid + '/role-mappings/realm'
      console.log(url)
      const axios = require('axios').default;
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
      axios.defaults.headers.post['Content-Type'] = 'application/json' // for POST requests
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
