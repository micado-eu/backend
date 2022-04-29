import {Entity, model, property, hasMany, hasOne} from '@loopback/repository';
import {IndividualInterventionPlan} from './individual-intervention-plan.model';
import {UserPictures} from './user-pictures.model';
import {UserPreferences} from './user-preferences.model';
import {UserConsent} from './user-consent.model';

@model()
export class Userone extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
  })
  id: string;

  @property({
    type: 'string',
  })
  realm?: string;

  @property({
    type: 'string',
  })
  group?: string;

  @hasMany(() => IndividualInterventionPlan)
  interventionPlans: IndividualInterventionPlan[];

  @hasOne(() => UserPictures)
  userPicture: UserPictures;

  @hasMany(() => UserPreferences, {keyTo: 'idUser'})
  userPreferences: UserPreferences[];

  @hasOne(() => UserConsent, {keyTo: 'idUser'})
  userConsent: UserConsent;

  constructor(data?: Partial<Userone>) {
    super(data);
  }
}

export interface UseroneRelations {
  // describe navigational properties here
}

export type UseroneWithRelations = Userone & UseroneRelations;
