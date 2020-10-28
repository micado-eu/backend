// Uncomment these imports to begin using these cool features!
import { get, post, param, HttpErrors } from '@loopback/rest';
import {
  CountlyService,

} from '../services/countly.service'
import { inject } from '@loopback/context';

// import {inject} from '@loopback/context';

const COUNTLY_MIGRANTS_API_KEY = process.env.COUNTLY_MIGRANTS_API_KEY || '';
const COUNTLY_MIGRANTS_APP_ID = process.env.COUNTLY_MIGRANTS_APP_ID || '';


export class CountlyController {
  constructor(
    @inject('services.Countly') protected countlyService: CountlyService,
  ) { }

  @get('/getDashboard')
  async getDashboard (
  ): Promise<any> {
    console.log(COUNTLY_MIGRANTS_API_KEY)
    console.log(COUNTLY_MIGRANTS_APP_ID)

    return this.countlyService.dashboard(
      COUNTLY_MIGRANTS_API_KEY,
      COUNTLY_MIGRANTS_APP_ID
    );
  }
}
