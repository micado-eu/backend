// Uncomment these imports to begin using these cool features!

// import {inject} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {UserRepository} from '../repositories';


export class UserWebhookController {
  constructor(
    @repository(UserRepository)
    public userRepository : UserRepository,
  ) {}

  @post('/users/webhook')
  async webhook(
    @requestBody({
      content: {
        'application/json': {       // Make sure this matches the POST request type
          'x-parser': 'raw',        // This is the key to skipping parsing
          schema: {type: 'object'},
        },
      },
    })
    user: Buffer,
  ): Promise<any> {
    console.log("webhook called")
    const rawBody = user.toString('utf8');
    console.log(rawBody)
    let registration = (0, eval)('(' + rawBody + ')');
    console.log(registration.userId)
    console.log(registration.realmId)
    
    if(registration.type == "REGISTER")
    {
      console.log("inside if")
      await this.userRepository.dataSource.execute('insert into "user" (id, realm, "group") values (' + "'" +  registration.userId+ "'" + ', '+ "'" + registration.realmId + "'" + ', \'\'); ')  
    }
    else{
      console.log("Not registration, nothing to do")
    }
  }
}
