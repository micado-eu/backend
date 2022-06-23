import { bind, BindingScope } from '@loopback/core';
import { repository } from '@loopback/repository';
import {
    LanguagesRepository,
    SettingsRepository
} from '../repositories';

var soap = require('soap');
var request = require('request')


@bind({ scope: BindingScope.SINGLETON })
export class EtranslationService {

    private wsdlUrl: string
    private et_user: string
    private et_password: string
    private source_language: string
    private req: any
    private target_langs: any
    private enabled: boolean

    constructor(@repository(SettingsRepository) protected settingsRepository: SettingsRepository,
        @repository(LanguagesRepository) protected languagesRepository: LanguagesRepository,
    ) {
        return (async (): Promise<EtranslationService> => {
            let settings: any = await this.settingsRepository.find({})
            let languages = await this.languagesRepository.find({ where: { active: true, isDefault: false } });

            console.log(settings)
            console.log(languages)
            this.target_langs = languages.map((language) => {
                return {
                    "target-language": language.lang.toUpperCase()
                }
            });
            console.log(this.target_langs)
            
            this.source_language = settings.filter((el: any) => { return el.key === 'default_language' })[0].value.toUpperCase()
            this.et_password = settings.filter((el: any) => { return el.key === 'e_translation_password' })[0].value
            this.et_user = settings.filter((el: any) => { return el.key === 'e_translation_user' })[0].value
            this.wsdlUrl = 'https://webgate.ec.europa.eu/etranslation/si/SecuredWSEndpointHandlerService?wsdl'
            this.enabled = Boolean(this.et_user) && Boolean(this.et_password)
            this.req = request.defaults({
                strictSSL: false
            });

            return this;
        })() as unknown as EtranslationService;
    }

    public getTranslation(requiredTranslation: String, id: string, contenttype: string): Promise<any> {
        //Preconditions
        if(!this.enabled)
            return new Promise((resolve, reject)=>{return reject("etranslation not configured")})
        console.log("in the etranslation service")
        console.log(requiredTranslation)
        var args = {
            arg0: {
                "external-reference": contenttype + "-" + id,
                "caller-information": {
                    "application": "MICADO_migrants_20201216",
                    "username": "gioppo",
                    "institution": "eu.europa.ec",
                    "department-number": "DGT.R.3.002"
                },
                "text-to-translate": requiredTranslation,
                "source-language": this.source_language,
                "target-languages": this.target_langs,
                "domain": "SPD",
                "output-format": "json",
                "requester-callback": "https://api.micadoproject.eu/e-translations",
                "destinations": {
                    "email-destination": ["luca.gioppo@csi.it"],
                }
            }
        };
        var options = {
            request: this.req,
            wsdl_options: {
                forever: true,
                rejectUnauthorized: false,
                strictSSL: false,
            },
            namespaceArrayElements: false
        }
        var authoptions = {
            'auth': {
                'user': this.et_user,
                'pass': this.et_password,
                'sendImmediately': false
            }
        }
        return new Promise((resolve, reject) => {
            soap.createClient(this.wsdlUrl, options, function (err: any, client: any) {
                console.log("created soap client")
                console.log(client.describe())
                console.log(JSON.stringify(client.describe()))
                console.log("prima chiamata translate")
                client.translate(args, function (err: any, result: any, rawResponse: any, soapHeader: any, rawRequest: any) {
                    console.log(err)
                    console.log("******************")
                    console.log(rawRequest);
                    console.log(rawResponse);
                    return resolve(result)
                }, authoptions);
            });
        })
    }


}
