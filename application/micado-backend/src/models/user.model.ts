import {Entity, model, property, hasMany, hasOne} from '@loopback/repository';
import {IndividualInterventionPlan} from './individual-intervention-plan.model';
import {UserPictures} from './user-pictures.model';
import {UserPreferences} from './user-preferences.model';
import {UserConsent} from './user-consent.model';
import {Tenant} from './tenant.model';

@model()
export class User extends Entity {
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

  @hasOne(() => Tenant, {keyTo: 'realm'})
  tenant: Tenant;

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
