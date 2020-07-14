// Uncomment these imports to begin using these cool features!

// import {inject} from '@loopback/context';
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
} from '@loopback/rest';
import { JSONObject } from '@loopback/core';
import { StepStepDocumentController } from './step-step-document.controller';
import { StepRepository } from '../repositories';

export class GraphController {
  constructor(
    @repository(StepRepository) public stepRepository: StepRepository,
  ) { }
  @post('/save-process-steps', {
    responses: {
      '200': {
        description: 'Saving result',
      },
    },
  })
  async persistallgraph (
    @requestBody()
    data: any,
  ): Promise<JSONObject> {
    let result: JSONObject = {}
    console.log(data)
    // save new steps
    let new_steps = data.steps.filter((step: any) => { return (step.is_new != null && step.is_new) })
    console.log("new steps")
    console.log(new_steps)
    const saveSteps = async () => {
      await this.asyncForEach(new_steps, async (nstep: any) => {

        // filter only needed data
        let savingStep = JSON.parse(JSON.stringify(nstep, ['id', 'cost', 'locationSpecific', 'location', 'locationLon', 'locationLat', 'idProcess']));
        // save new step
        await this.stepRepository.create(savingStep)
          .then(
            result => {
              console.log("saved step")
              console.log(result)
            }
          )
        // save translations
        const saveTranslations = async () => {
          await this.asyncForEach(nstep.translations, async (transl: any) => {

            let savingTranslation = JSON.parse(JSON.stringify(transl, ['id', 'lang', 'step', 'description']));
            let trid = nstep.id
            console.log(savingTranslation)

            this.stepRepository.translations(trid).create(savingTranslation)
              .then((trres) => {
                console.log("saved translation")
                console.log(trres)
              }).catch(error => {
                console.log(error)
              })

          });
        }
        await saveTranslations()

        // here we need also to save the documents of the step
      });
    }
    await saveSteps()
    // save translations of new steps

    let changed_steps = data.steps.filter((step: any) => { return (step.is_edited != null && (step.is_edited && !step.is_new)) })
    console.log("changed_steps")
    console.log(changed_steps)
    const editSteps = async () => {
      await this.asyncForEach(changed_steps, async (cstep: any) => {

        // filter only needed data
        let editingStep = JSON.parse(JSON.stringify(cstep, ['id', 'cost', 'locationSpecific', 'location', 'locationLon', 'locationLat', 'idProcess']));
        // save new step
        await this.stepRepository.updateById(editingStep.id, editingStep)
          .then(
            result => {
              console.log("edited step")
              console.log(result)
            }
          )
        // save translations
        const editTranslations = async () => {
          await this.asyncForEach(cstep.translations, async (transl: any) => {

            let editingTranslation = JSON.parse(JSON.stringify(transl, ['id', 'lang', 'step', 'description']));
            let trid = cstep.id
            console.log(editingTranslation)
            let where = {
              id: { eq: editingTranslation.id }, lang: { eq: editingTranslation.lang }
            }
            this.stepRepository.translations(trid).patch(editingTranslation, where)
              .then((trres) => {
                console.log("saved translation")
                console.log(trres)
              }).catch(error => {
                console.log(error)
              })

          });
        }
        await editTranslations()

        // here we need also to save the documents of the step
      });
    }
    await editSteps()


    // add the new steplinks

    // edit steplinks

    // delete step links

    // delete step

    return result
  }

  async asyncForEach (array: any, callback: any) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }
}
