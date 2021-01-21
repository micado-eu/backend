// Uncomment these imports to begin using these cool features!
import { get, post, param, HttpErrors } from '@loopback/rest';
import {
  RasaService,

} from '../services/rasa.service'
import { inject } from '@loopback/context';

// import {inject} from '@loopback/context';

const COUNTLY_MIGRANTS_API_KEY = process.env.COUNTLY_MIGRANTS_API_KEY || '';
const COUNTLY_MIGRANTS_APP_ID = process.env.COUNTLY_MIGRANTS_APP_ID || '';
const ANALYTIC_HOSTNAME = process.env.ANALYTIC_HOSTNAME || '';


export class RasaController {
  constructor(
    @inject('services.Rasa') protected rasaService: RasaService,
  ) { }

  @get('/trainModel')
  async trainModel (
  ): Promise<any> {
    console.log(COUNTLY_MIGRANTS_API_KEY)
    console.log(COUNTLY_MIGRANTS_APP_ID)
    console.log(process.env.COUNTLY_ADMIN)
    console.log(process.env.COUNTLY_ADMIN_PWD)

    let testPayload = {
      "config": "language: en\npipeline:\n - name: WhitespaceTokenizer\n - name: RegexFeaturizer\n - name: CRFEntityExtractor\n - name: EntitySynonymMapper\n - name: CountVectorsFeaturizer\n - name: EmbeddingIntentClassifier\npolicies:\n - name: MemoizationPolicy\n - name: KerasPolicy\n - name: MappingPolicy\n - name: FormPolicy\n",
      "nlu": "## intent:new_intent_to_train_on\n - new_utter_to_train_on for new_entity_to_train_on_value\n - new_utter_to_train_on for new_entity_to_train_on_value\n## intent:greet\n - hey\n - hello\n## intent:goodbye\n - cu\n - goodbye\n## intent:mood_great\n - Great!!\n - happy\n## intent:mood_unhappy\n - sad\n - Terrible",
      "stories": "##new_intent_to_train_on Path from model train without utter_slot_values\n* greet\n - utter_greet\n* new_intent_to_train_on\n - new_intent_to_train_on_form\n - form{\"name\": \"new_intent_to_train_on_form\"}\n - form{\"name\": null}\n\n## happy path\n * greet\n - utter_greet\n* mood_great\n - utter_happy\n\n## sad path 1\n * greet\n - utter_greet\n* mood_unhappy\n - utter_cheer_up\n",
      "domain": "entities:\n - new_entity_to_train_on\nintents:\n - new_intent_to_train_on\n - greet\n - goodbye\n - affirm\n - deny\n - mood_great\n - mood_unhappy\n\nactions:\n - utter_slots_values\n - utter_greet\n - utter_cheer_up\n - utter_did_that_help\n - utter_happy\n - utter_goodbye\ntemplates:\n utter_slots_values:\n - text: new_utter_output_to_send:\n\n- new_entity_to_train_message_values : {new_entity_to_train_on}\n\n\n utter_greet:\n - text: Hey! How are you?\n\n utter_cheer_up:\n - text: Here is something to cheer you up:\n image: https://i.imgur.com/nGF1K8f.jpg\\n\n utter_did_that_help:\n - text: Did that help you?\n\n utter_happy:\n - text: Great carry on!\n\n utter_goodbye:\n - text: Bye\n\nforms:\n - new_intent_to_train_on_form\nslots:\n new_entity_to_train_on:\n type: unfeaturized\n auto_fill: false",
      "out": "models",
      "force": true
    }

    console.log(testPayload)
    return this.rasaService.train(
      "thisismysecret",
      testPayload,
      "192.168.1.130"
    );
  }

}
