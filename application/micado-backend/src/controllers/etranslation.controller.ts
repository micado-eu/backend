// Uncomment these imports to begin using these cool features!
import { get, post, param, del, patch, HttpErrors } from '@loopback/rest';
import {service} from '@loopback/core';

import {EtranslationService} from '../services/etranslation.service'

export class EtranslationController {
  constructor(
    @service() public etranslationService: EtranslationService,

  ) { }


  @get('/getTranslation/{content}')
  async getTranslation(
    @param.path.string('content') requiredTranslation: String,
  ): Promise<any> {
    //Preconditions
    console.log("in the etranslation controller")
    console.log(requiredTranslation)
    return this.etranslationService.getTranslation(requiredTranslation,"1","process")
  }
}

