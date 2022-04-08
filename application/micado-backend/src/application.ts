// ---------- ADD IMPORTS -------------
import {AuthenticationComponent} from '@loopback/authentication';
//import {  JWTAuthenticationComponent} from '@loopback/authentication-jwt';
//import {AuthenticationComponent, Strategies} from 'loopback4-authentication';
import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {CrudRestComponent} from '@loopback/rest-crud';
import {
  RestExplorerBindings,
  RestExplorerComponent
} from '@loopback/rest-explorer';
import {ServiceMixin} from '@loopback/service-proxy';
import multer from 'multer';
import path from 'path';
import {MySequence} from './sequence';
import {FILE_UPLOAD_SERVICE, STORAGE_DIRECTORY} from './services/file-upload-service.service';
//import { KeycloakVerifyProvider } from './modules/keycloak-verify.provider';
import {registerAuthenticationStrategy} from '@loopback/authentication';
import {MicadoAuthenticationStrategy} from './modules/micado-strategy'
export class MicadoBackendApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {
    cors: {
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      preflightContinue: true,
      optionsSuccessStatus: 204,
      maxAge: 86400,
      credentials: false,
    }
    
  }) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    // Configure file upload with multer options
    this.configureFileUpload(options.fileStorageDirectory);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
    this.component(CrudRestComponent);
    // ------ ADD SNIPPET AT THE BOTTOM ---------
    // Mount authentication system
    this.component(AuthenticationComponent);
    registerAuthenticationStrategy(this, MicadoAuthenticationStrategy);
    // Mount jwt component
  //  this.component(JWTAuthenticationComponent);
  // Customize authentication verify handlers
    //this.bind(Strategies.Passport.KEYCLOAK_VERIFIER).toProvider(   KeycloakVerifyProvider,  );
  }

  /**
 * Configure `multer` options for file upload
 */
  protected configureFileUpload (destination?: string) {
    // Upload files to `dist/.sandbox` by default
    destination = destination ?? path.join(__dirname, '../.sandbox');
    this.bind(STORAGE_DIRECTORY).to(destination);
    const multerOptions: multer.Options = {
      storage: multer.diskStorage({
        destination,
        // Use the original file name as is
        filename: (req, file, cb) => {
          cb(null, file.originalname);
        },
      }),
    };
    // Configure the file upload service with multer options
    this.configure(FILE_UPLOAD_SERVICE).to(multerOptions);
  }
}
