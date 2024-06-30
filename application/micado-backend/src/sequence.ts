// ---------- ADD IMPORTS -------------
import { AuthenticateFn, AuthenticationBindings, AUTHENTICATION_STRATEGY_NOT_FOUND, USER_PROFILE_NOT_FOUND } from '@loopback/authentication';
import { inject } from '@loopback/context';
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



/**
 * Implements the sequence handler for the application's REST API.
 * The sequence handler is responsible for handling the request lifecycle, including authentication, invoking middleware, finding the route, parsing parameters, invoking the method, and sending the response.
 */
export class MySequence implements SequenceHandler {
  @inject(SequenceActions.INVOKE_MIDDLEWARE, { optional: true }) protected invokeMiddleware: InvokeMiddleware = () => false;
  constructor(
    @inject(SequenceActions.FIND_ROUTE) protected findRoute: FindRoute,
    @inject(SequenceActions.PARSE_PARAMS) protected parseParams: ParseParams,
    @inject(SequenceActions.INVOKE_METHOD) protected invoke: InvokeMethod,
    @inject(SequenceActions.SEND) public send: Send,
    @inject(SequenceActions.REJECT) public reject: Reject,
    @inject(AuthenticationBindings.AUTH_ACTION) protected authenticateRequest: AuthenticateFn,
  ) { }

  async handle(context: RequestContext) {
    try {
      const { request, response } = context;
      console.log("\nSequence-handle: - method " + request.method)

      if (request.headers['user-agent']?.includes('Apache-HttpClient') && !request.headers['content-type']) {
        console.log("call from e-translation ")
        request.headers['content-type'] = 'text/plain'
      }
      const finished = await this.invokeMiddleware(context);
      console.log('nella sequence - finished:' + finished)
      if (finished) return;
      const route = this.findRoute(request);
      console.log('nella sequence - route:' + route)
      //call authentication action
      const authUser: any = await this.authenticateRequest(request);
      console.log('in the sequence - authUser:' + authUser)
      const args = await this.parseParams(request, route);
      const result = await this.invoke(route, args);
      this.send(response, result);
    } catch (err) {
      console.log('sequence - err:' + err)
      if (
        err.code === AUTHENTICATION_STRATEGY_NOT_FOUND ||
        err.code === USER_PROFILE_NOT_FOUND
      ) {
        Object.assign(err, { statusCode: 401 /* Unauthorized */ });
      }
      this.reject(context, err);
    }
  }
}
