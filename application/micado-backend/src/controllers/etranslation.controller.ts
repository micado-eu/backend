// Uncomment these imports to begin using these cool features!
import { get, post, param, del, patch, HttpErrors } from '@loopback/rest';
import {service} from '@loopback/core';

import {EtranslationService} from '../services/etranslation.service'

export class EtranslationController {
  constructor(
    @service() public etranslationService: EtranslationService,

  ) { }


  @get('/getTranslation')
  async getTranslation(
    @param.query.string('content') requiredTranslation: string,
    @param.query.string('table') table: string,
    @param.query.string('type') type: string,
    @param.query.string('id') id: string,
  ): Promise<any> {
    //Preconditions
    console.log("in the etranslation controller")
    console.log(requiredTranslation)
    return this.etranslationService.getTranslation(requiredTranslation, id, table, type)
  }
}

