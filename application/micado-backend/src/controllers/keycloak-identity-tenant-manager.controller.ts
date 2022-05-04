// Uncomment these imports to begin using these cool features!
import {inject} from '@loopback/context';
import {get, param, post, put} from '@loopback/rest';
import {
  KeycloakService
} from '../services/keycloak.service';
const querystring = require('querystring');


const innerPort = (process.env.MICADO_ENV != undefined && process.env.MICADO_ENV.localeCompare("dev") == 0 ? "" : ":8443")
export class KeycloakIdentityTenantManagerController {
  constructor(
    //@repository(TenantRepository) public tenantRepository: TenantRepository,
    @inject('services.Keycloak') protected keycloakService: KeycloakService,
  ) { }


  @get('/getAdminToken')
  async getAdminToken(
    @param({name: 'realm', in: 'query', required: false}) realm: string,
  ): Promise<any> {
    //Preconditions
    let data
    switch (realm) {
      case 'migrant':
        console.log('migrant');

        data= {
          username: process.env.WSO2_IDENTITY_ADMIN_USER,
          password: process.env.WSO2_IDENTITY_ADMIN_PWD,
          client_id:'migrant-realm',
          client_secret:process.env.MIGRANT_REALM_CLIENT_SECRET,
          grant_type:"password",
        }
        console.log(data)
        break;
      case 'pa':
        console.log('pa');

        data= {
          username: process.env.WSO2_IDENTITY_ADMIN_USER,
          password: process.env.WSO2_IDENTITY_ADMIN_PWD,
          client_id:'pa-realm',
          client_secret:process.env.PA_REALM_CLIENT_SECRET,
          grant_type:"password",
        }
        break;
      case 'ngo':
        console.log('Ngo realm chosen');

        data= {
          username: process.env.WSO2_IDENTITY_ADMIN_USER,
          password: process.env.WSO2_IDENTITY_ADMIN_PWD,
          client_id:'ngo-realm',
          client_secret:process.env.NGO_REALM_CLIENT_SECRET,
          grant_type:"password",
        }
        break;
      default:
        console.log('No realm chosen');

    }
    console.log("I am")
    console.log(data)
    let manager =  await this.keycloakService.getManager(
      process.env.IDENTITY_HOSTNAME + innerPort,
      querystring.stringify(data)
    )
    let token = JSON.parse(manager).access_token
    console.log(token)
    return token
  }



  @post('/createKeycloakUser')
  async createUser(
    @param({name: 'username', in: 'query', required: false}) username: string,
    @param({name: 'firstName', in: 'query', required: false}) firstName: string,
    @param({name: 'lastName', in: 'query', required: false}) lastName: string,
    @param({name: 'email', in: 'query', required: false}) email: string,
    @param({name: 'password', in: 'query', required: false}) password: string,
    @param({name: 'realm', in: 'query', required: false}) realm: string,
    @param({name: 'token', in: 'query', required: false}) token: string,
  ): Promise<any> {
    //Preconditions
    
    console.log(username)
    console.log(realm)
    console.log(token)
    return this.keycloakService.createUser(
      username,
      firstName,
      lastName,
      email,
      password,
      realm,
      token,
      process.env.IDENTITY_HOSTNAME + innerPort
    );
  }
  @post('/createKeycloakUserWithRole')
  async createUserWithRole(
    @param({name: 'username', in: 'query', required: false}) username: string,
    @param({name: 'firstName', in: 'query', required: false}) firstName: string,
    @param({name: 'lastName', in: 'query', required: false}) lastName: string,
    @param({name: 'email', in: 'query', required: false}) email: string,
    @param({name: 'password', in: 'query', required: false}) password: string,
    @param({name: 'realm', in: 'query', required: false}) realm: string,
    @param({name: 'token', in: 'query', required: false}) token: string,
    @param({name: 'role', in: 'query', required: false}) role: string,
  ): Promise<any> {
    //Preconditions
    await this.createUser(username,firstName,lastName,email, password, realm, token)
    const user = await this.keycloakService.getUser(
      process.env.IDENTITY_HOSTNAME + innerPort,
      realm,
      username,
      token
    )
    console.log("I am new user")
    console.log(user)
    if (role.length > 0) {
      console.log("inside if")
      console.log(user)
      await this.addRole(realm,  token, user[0].id, role)
      return user
    }
    else {
      return user
    }
  }

  @post('/createKeycloakUserWithRoleAndGroup')
  async createKeycloakUserWithRoleAndGroup(
    @param({name: 'username', in: 'query', required: false}) username: string,
    @param({name: 'firstName', in: 'query', required: false}) firstName: string,
    @param({name: 'lastName', in: 'query', required: false}) lastName: string,
    @param({name: 'email', in: 'query', required: false}) email: string,
    @param({name: 'password', in: 'query', required: false}) password: string,
    @param({name: 'realm', in: 'query', required: false}) realm: string,
    @param({name: 'role', in: 'query', required: false}) role: string,
    @param({name: 'group', in: 'query', required: false}) group: string,
  ): Promise<any> {
    //Preconditions

    let token = await this.getAdminToken('ngo')
    let group_array = []
    group_array.push(group)
    console.log( JSON.stringify(group_array))
    await this.keycloakService.createUserWithGroup(
      username,firstName,lastName,email, password, group_array, realm, token,       process.env.IDENTITY_HOSTNAME + innerPort,

    )
    //await this.createUser(username,firstName,lastName,email, password, realm, token)
    var user = await this.keycloakService.getUser(
      process.env.IDENTITY_HOSTNAME + innerPort,
      realm,
      username,
      token
    )
    console.log("I am new user")
    console.log(user)
    //await this.addToGroup(user[0].id, group, realm, token)
    let roles_array = JSON.parse(role)
    if (roles_array.length > 0) {
      console.log("inside if")
      console.log(user)
      await this.addRole(realm, token, user[0].id, roles_array)
      return user
    }
    else {
      return user
    }
  }

  @get('/getClientRoles')
  async getClientRoles(
    @param({name: 'realm', in: 'query', required: false}) realm: string,
    @param({name: 'clientId', in: 'query', required: false}) clientId: string,
    @param({name: 'token', in: 'query', required: false}) token: string,
  ): Promise<any> {
    //Preconditions
    return this.keycloakService.getClientRoles(
      process.env.IDENTITY_HOSTNAME + innerPort,
      realm,
      clientId,
      token
    );

  }

  @get('/getUser')
  async getUser(
    @param({name: 'realm', in: 'query', required: false}) realm: string,
    @param({name: 'id', in: 'query', required: false}) id: string,
    @param({name: 'token', in: 'query', required: false}) token: string,
  ): Promise<any> {
    //Preconditions
    return this.keycloakService.getUser(
      process.env.IDENTITY_HOSTNAME + innerPort,
      realm,
      id,
      token
    );
  }

  @get('/getPaUserList')
  async getPaUserList(
  ): Promise<any> {
    //Preconditions
    let token = await this.getAdminToken('pa')
    return this.keycloakService.getUserList(
      process.env.IDENTITY_HOSTNAME + innerPort,
      'pa',
      token
    );
  }

  @get('/getMigrantUserList')
  async getMigrantUserList(
    ): Promise<any> {
    //Preconditions
    let token = await this.getAdminToken('migrant')
    return this.keycloakService.getUserList(
      process.env.IDENTITY_HOSTNAME + innerPort,
      'migrant',
      token
    );
  }

  @get('/getNgoUserList')
  async getNgoUserList(
    @param({name: 'group_name', in: 'query', required: false}) group_name: string,
    ): Promise<any> {
    //Preconditions
    let token = await this.getAdminToken('ngo')
    let groupId = await this.keycloakService.getGroupId(process.env.IDENTITY_HOSTNAME + innerPort,'ngo', token)
    console.log("I am groupid")
    console.log(groupId)
     let groupIdString = groupId.filter((group:any)=>{
      return group.name == group_name
    })[0].id
    console.log(groupIdString)
    return this.keycloakService.getGroupMembers(
      process.env.IDENTITY_HOSTNAME + innerPort,
      'ngo',
      groupIdString,
      token
    );
  }

  @get('/getGroupList')
  async getGroupList(
    @param({name: 'realm', in: 'query', required: false}) realm: string,
    @param({name: 'token', in: 'query', required: false}) token: string,
  ): Promise<any> {
    return this.keycloakService.getGroupList(
      process.env.IDENTITY_HOSTNAME + innerPort,
      realm,
      token
    );
  }

  @get('/getClientId')
  async getClientId(
    @param({name: 'realm', in: 'query', required: false}) realm: string,
    @param({name: 'clientId', in: 'query', required: false}) clientId: string,
    @param({name: 'token', in: 'query', required: false}) token: string,
  ): Promise<any> {
    //Preconditions
    return this.keycloakService.getClientId(
      process.env.IDENTITY_HOSTNAME + innerPort,
      realm,
      clientId,
      token
    );

  }

  @get('/getGroupId')
  async getGroupId(
    @param({name: 'realm', in: 'query', required: false}) realm: string,
    @param({name: 'token', in: 'query', required: false}) token: string,
  ): Promise<any> {
    //Preconditions
    return this.keycloakService.getGroupId(
      process.env.IDENTITY_HOSTNAME + innerPort,
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
  ): Promise<any> {
    //Preconditions
    let groups = await this.getGroupList(realm, token)
    let groupStringId = groups.filter((group:any)=>{
      return group.name == groupId
    })[0].id
    console.log(groupStringId)
    return this.keycloakService.addToGroup(
      userId,
      groupStringId,
      realm,
      token,
      process.env.IDENTITY_HOSTNAME + innerPort
    );

  }

  @post('/createGroup')
  async createGroup(
    @param({name: 'name', in: 'query', required: false}) name: string,
    @param({name: 'realm', in: 'query', required: false}) realm: string,
  ): Promise<any> {
    let data= {
      username: process.env.WSO2_IDENTITY_ADMIN_USER,
      password: process.env.WSO2_IDENTITY_ADMIN_PWD,
      client_id:"ngo-realm",
      client_secret:process.env.NGO_REALM_CLIENT_SECRET,
      grant_type:"password",
    }
    console.log(data)
    let manager =  await this.keycloakService.getManager(
      process.env.IDENTITY_HOSTNAME + innerPort,
      querystring.stringify(data)
    )
    let token = JSON.parse(manager).access_token
    return this.keycloakService.createGroup(
      name,
      realm,
      token,
      process.env.IDENTITY_HOSTNAME + innerPort
    );

  }

  @post('/addRoleToUser')
  async addRole(
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
      process.env.IDENTITY_HOSTNAME + innerPort,
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
      const url = 'https://' + process.env.IDENTITY_HOSTNAME + innerPort + '/auth/admin/realms/' + realm + '/users/' + userid + '/role-mappings/realm'
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


    })
  }

  @put('/updateUser')
  async updateUser(
    @param({name: 'userid', in: 'query', required: false}) userid: string,
    @param({name: 'firstName', in: 'query', required: false}) firstName: string,
    @param({name: 'lastName', in: 'query', required: false}) lastName: string,
    @param({name: 'email', in: 'query', required: false}) email: string,
    @param({name: 'realm', in: 'query', required: false}) realm: string,
  ): Promise<any> {
    //Preconditions
    let token = await this.getAdminToken(realm)

    return this.keycloakService.updateUser(
      userid,
      firstName,
      lastName,
      email,
      realm,
      token,
      process.env.IDENTITY_HOSTNAME + innerPort
    );
  }

  @put('/updateUserPassword')
  async updateUserPassword(
    @param({name: 'userid', in: 'query', required: false}) userid: string,
    @param({name: 'password', in: 'query', required: false}) password: string,
    @param({name: 'realm', in: 'query', required: false}) realm: string,
  ): Promise<any> {
    //Preconditions
    let token = await this.getAdminToken(realm)

    return this.keycloakService.updateUserPassword(
      userid,
      password,
      realm,
      token,
      process.env.IDENTITY_HOSTNAME + innerPort
    );
  }

}
