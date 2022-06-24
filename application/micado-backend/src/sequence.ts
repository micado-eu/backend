// ---------- ADD IMPORTS -------------
import {  AuthenticateFn,  AuthenticationBindings,  AUTHENTICATION_STRATEGY_NOT_FOUND,  USER_PROFILE_NOT_FOUND} from '@loopback/authentication';
//import {AuthenticateFn, AuthenticationBindings} from 'loopback4-authentication';
/*
import {
  AuthorizationBindings,
  AuthorizeErrorKeys,
  AuthorizeFn,
} from 'loopback4-authorization';
*/
import {AuthUser} from './models';
import {inject} from '@loopback/context';
import {
  FindRoute,
  InvokeMethod,
  InvokeMiddleware,
  ParseParams,
  Reject,
  RequestContext,
  RestBindings,
  Send,
  SequenceHandler
} from '@loopback/rest';

const SequenceActions = RestBindings.SequenceActions;



export class MySequence implements SequenceHandler {
  //-----snippet added to try to fix cors----------
@inject(SequenceActions.INVOKE_MIDDLEWARE, {optional: true}) protected invokeMiddleware: InvokeMiddleware = () => false;
//---------end snippet---------
  constructor(
    @inject(SequenceActions.FIND_ROUTE) protected findRoute: FindRoute,
    @inject(SequenceActions.PARSE_PARAMS) protected parseParams: ParseParams,
    @inject(SequenceActions.INVOKE_METHOD) protected invoke: InvokeMethod,
    @inject(SequenceActions.SEND) public send: Send,
    @inject(SequenceActions.REJECT) public reject: Reject,
    @inject(AuthenticationBindings.AUTH_ACTION) protected authenticateRequest: AuthenticateFn,
  ) {}

  async handle(context: RequestContext) {
    try {
      const {request, response} = context;
      //response.header('Access-Control-Allow-Origin', '*');
        //    response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, access-control-allow-origin');
        console.log(request.method)
        console.log(request.headers['user-agent'])
        console.log(request.headers['content-type'])

        if(request.headers['user-agent']?.includes('Apache-HttpClient') && !request.headers['content-type']){
          console.log("call from e-translation ")
          request.headers['content-type']='text/plain'
        }
                /*if (request.method == 'OPTIONS') {
                console.log("I AM IN THE SEQUENCE FOR AN OPTION REQUEST")
                response.status(200)
                this.send(response, 'ok');
            } else {*/
              const finished = await this.invokeMiddleware(context);
              if (finished) return;
              const route = this.findRoute(request);
              // ------ ADD SNIPPET ---------
              //call authentication action
              //console.log(request)
              const authUser: any = await this.authenticateRequest(request);
              //console.log(authUser)
              // ------------- END OF SNIPPET -------------
              /*
              const authUser: AuthUser = await this.authenticateRequest(
                request,
                response,
              );
              */
              console.log('nella sequence')
              const args = await this.parseParams(request, route);
              const result = await this.invoke(route, args);
              this.send(response, result);
            //}
    } catch (err) {
      // ------ ADD SNIPPET ---------
      if (
        err.code === AUTHENTICATION_STRATEGY_NOT_FOUND ||
        err.code === USER_PROFILE_NOT_FOUND
      ) {
        Object.assign(err, {statusCode: 401 /* Unauthorized */});
      }
      // ------------- END OF SNIPPET -------------
      this.reject(context, err);
    }
  }
}
