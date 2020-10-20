import {bind, inject, BindingScope, DefaultConfigurationResolver} from '@loopback/core';
import {promises as fsAsync} from 'fs';
import fs from 'fs';
import simpleGit, {ResetMode, SimpleGit} from 'simple-git';
import { createEmptyApiSpec } from '@loopback/rest';
import { CommentsTranslationRepository, DocumentTypeTranslationRepository, EventCategoryTranslationRepository, EventTagTranslationRepository, EventTranslationRepository, FeaturesFlagsTranslationRepository, GlossaryTranslationRepository, InformationCategoryTranslationRepository, InformationTagTranslationRepository, InformationTranslationRepository, InterventionCategoryTranslationRepository, InterventionTypesTranslationRepository, PictureHotspotTranslationRepository, ProcessTranslationRepository, StepLinkTranslationRepository, StepTranslationRepository, TopicTranslationRepository, UserTypesTranslationRepository } from '../repositories';
import {CrudRepositoryImpl, repository} from '@loopback/repository';


// Should come from a config file or the database.
const MICADO_SOURCE_LANGUAGE = process.env.MICADO_SOURCE_LANGUAGE || 'en';
const MICADO_GIT_URL = process.env.MICADO_GIT_URL || '';
const MICADO_TRANSLATIONS_DIR = process.env.MICADO_TRANSLATIONS_DIR || '/tmp/translations';


@bind({scope: BindingScope.SINGLETON})
export class TranslationService {
  private componentRepos: {[componentName: string]: any}; // Any now but should be an interface that all repos inherit from.
  private gitInitialized: boolean;
  private git: SimpleGit;

  constructor(
    @repository(CommentsTranslationRepository) public commentsTranslationRepository: CommentsTranslationRepository,
    @repository(DocumentTypeTranslationRepository) public documentTypeTranslationRepository: DocumentTypeTranslationRepository,
    @repository(EventCategoryTranslationRepository) public eventCategoryTranslationRepository: EventCategoryTranslationRepository,
    @repository(EventTagTranslationRepository) public eventTagTranslationRepository: EventTagTranslationRepository,
    @repository(EventTranslationRepository) public eventTranslationRepository: EventTranslationRepository,
    @repository(FeaturesFlagsTranslationRepository) public featuresFlagsTranslationRepository: FeaturesFlagsTranslationRepository,
    @repository(GlossaryTranslationRepository) public glossaryTranslationRepository: GlossaryTranslationRepository,
    @repository(InformationCategoryTranslationRepository) public informationCategoryTranslationRepository: InformationCategoryTranslationRepository,
    @repository(InformationTagTranslationRepository) public informationTagTranslationRepository: InformationTagTranslationRepository,
    @repository(InformationTranslationRepository) public informationTranslationRepository: InformationTranslationRepository,
    @repository(InterventionCategoryTranslationRepository) public interventionCategoryTranslationRepository: InterventionCategoryTranslationRepository,
    @repository(InterventionTypesTranslationRepository) public interventionTypesTranslationRepository: InterventionTypesTranslationRepository,
    @repository(PictureHotspotTranslationRepository) public pictureHotspotTranslationRepository: PictureHotspotTranslationRepository,
    @repository(ProcessTranslationRepository) public processTranslationRepository: ProcessTranslationRepository,
    @repository(StepLinkTranslationRepository) public stepLinkTranslationRepository: StepLinkTranslationRepository,
    @repository(StepTranslationRepository) public stepTranslationRepository: StepTranslationRepository,
    @repository(TopicTranslationRepository) public topicTranslationRepository: TopicTranslationRepository,
    @repository(UserTypesTranslationRepository) public userTypesTranslationRepository: UserTypesTranslationRepository,
  ) {
      this.gitInitialized = false;

    // Map component names to their repos. TODO: should be done automatically.
    this.componentRepos = {
      //'comments': this.commentsTranslationRepository,
      'document_type': this.documentTypeTranslationRepository,/*
      'event_category': this.eventCategoryTranslationRepository,
      'event_tag': this.eventTagTranslationRepository,
      'event': this.eventTranslationRepository,
      'features_flags': this.featuresFlagsTranslationRepository,
      'glossary': this.glossaryTranslationRepository,
      'information_category': this.informationCategoryTranslationRepository,
      'information': this.informationTranslationRepository,
      'intervention_category': this.interventionCategoryTranslationRepository,
      'intervention_types': this.interventionTypesTranslationRepository,
      'picture_hotspot': this.pictureHotspotTranslationRepository,
      'process': this.processTranslationRepository,
      'step_link': this.stepLinkTranslationRepository,
      'step': this.stepTranslationRepository,
      'topic': this.topicTranslationRepository,
      'user_types': this.userTypesTranslationRepository,*/
    };
  }

  public async install(): Promise<any> {
    for(let componentName in this.componentRepos) {
      // Remove previous files in git.
      fs.readdirSync(MICADO_TRANSLATIONS_DIR).filter(
        fn => (fn.startsWith(componentName) && fn.endsWith('.json'))
      ).forEach((filename) => {
        fs.unlinkSync(MICADO_TRANSLATIONS_DIR + '/' + filename);
      });
    }

    // Generate empty base language files.
    for(let componentName in this.componentRepos) {
      let file: any = {};
      file[MICADO_SOURCE_LANGUAGE] = {};
      this.generateFiles(componentName, file);
    }

    await this.git.add('-u');
    await this.git.add('./*.json');
    await this.git.commit('Fresh install');
    await this.git.push('origin', 'master', {'--force': null});
  }

  /**
   * Initialize the service. Always call this and wait for the promise to resolve before using it.
   */
  public initializeService(): Promise<null> {
    return new Promise((resolve, reject) => {
      if(this.gitInitialized) {
        resolve();
      }
  
      if(!fs.existsSync(MICADO_TRANSLATIONS_DIR)){
        fs.mkdirSync(MICADO_TRANSLATIONS_DIR);
      }
      
      this.git = simpleGit(MICADO_TRANSLATIONS_DIR);
      
      if(MICADO_GIT_URL === '') {
        console.log('MICADO_GIT_URL environment variable is not set, this is required for the translation service to work.');
      }
            
      this.git.checkIsRepo()
      .then((isRepo) => {
        if(!isRepo) {
          console.log('no repo');
          return this.git.clone(MICADO_GIT_URL, '.')
            .then(() => {
              return this.git.pull('origin', 'master');
            })
            .then(() => {
              return this.git.addConfig('user.name', 'backend');
            })
            .then(() => {
              return this.git.addConfig('user.email', 'backend@backend.backend')
            });
        }
      })
      .then(() => {
        this.gitInitialized = true;
        resolve();
      })
      .catch((reason) => {
        console.log('Could not initialize git: ', reason);
        reject(reason);
      });
    });
  }

  public async updateTranslatables() {
    /*// Get all components
    let resp = await this.weblateService.components('micado-english');

    // Lock all components
    for(let i = 0; i < resp.results.length; i++) {
      await this.weblateService.lock('micado-english', resp.results[i].slug, true);
    }

    // Make weblate push changes
    await this.weblateService.git('micado-english', 'commit');
    await this.weblateService.git('micado-english', 'push');

    */


    await this.git.pull('origin', 'master');

    // Merge changes from weblate to database.
    for(let componentName in this.componentRepos) {
      await this.importTranslatablesComponent(componentName);
    }

    let componentBaseLanguageStrings: any = {};
    for(let componentName in this.componentRepos) {
      componentBaseLanguageStrings[componentName] = await this.updateComponentInGit(componentName);
    }

 
    await this.git.commit('New base language files generated');
    await this.git.push('origin', 'master');

    for(let componentName in this.componentRepos) {
      await this.componentRepos[componentName].updateToTranlating(componentBaseLanguageStrings[componentName]);
    }
    

    
    /*
    // Unlock all components
    for(let i = 0; i < resp.results.length; i++) {
      await this.weblateService.lock('micado-english', resp.results[i].slug, false);
    }*/

    
  }
  private async updateComponentInGit(componentName: string) {
    if(!this.gitInitialized) {
      console.log('Git is not initalized yet, try again later.');
      return;
    }

    // Get the repository for this component.
    const repo = this.componentRepos[componentName];

    // All strings in the base language that should be in git. (because they have siblings in 'translatable', 'translating' state.)
    let baseLanguageStrings = await repo.getBaseLanguageTranslatables(MICADO_SOURCE_LANGUAGE);

    // All languages for this component that should be in git. (so we can create an empty file if it's not in git yet so that weblate will add that language)
    let languagesThatShouldBeInGit = await repo.getTranslatableLanguages();

    let files: {[language: string]: {[key: string]: string}} = {};

    // Add all base language strings we need.
    baseLanguageStrings.forEach((translatable: any) => {
      if(!(translatable.lang in files)) {
        files[translatable.lang] = {};
      }

      files[translatable.lang][translatable.id.toString() + '.' + componentName] = translatable.text;      
    });

    // Add empty files for languages if not already in git.
    languagesThatShouldBeInGit.forEach((translatable: any) => {
      if(translatable.lang === MICADO_SOURCE_LANGUAGE) {
        return;
      }

      if(!fs.existsSync(MICADO_TRANSLATIONS_DIR + '/' + componentName + '.' + translatable.lang + '.json')) {
        files[translatable.lang] = {};
      }
    });

    if(!files.hasOwnProperty(MICADO_SOURCE_LANGUAGE)) {
      // We need atleast an empty file for the source language in weblate.
      files[MICADO_SOURCE_LANGUAGE] = {};
    }

    // Remove previous file in git.
    fs.readdirSync(MICADO_TRANSLATIONS_DIR).filter(
      fn => (fn === (componentName + '.' + MICADO_SOURCE_LANGUAGE + '.json'))
    ).forEach((filename) => {
      fs.unlinkSync(MICADO_TRANSLATIONS_DIR + '/' + filename);
    });

    // Generate the file on the filesystem and push them to git.
    let results = this.generateFiles(componentName, files);
    let done = await Promise.all(results);
    await this.git.add(componentName + '.*.json');

    return baseLanguageStrings;
   }

   /*
   public async uploadTranslatables() {
     
     for(let componnent in this.componentRepos) {
      await this.uploadTranslatablesComponent(componnent);
     }
   }

   private async generateFilesDictionary() {
    for(let componnentName in this.componentRepos) {
      
     }
   }

   private async uploadTranslatablesComponent(componentName: string) {
    if(!this.gitInitialized) {
      console.log('Git is not initalized yet, try again later.');
      return;
    }

    // First we import pending translations to lessen the chance on merge conflicts.
    // In the future this can be replaced with just a git reset and the importing can be called from another controller if needed.
    await this.importTranslatablesComponent(componentName);

    console.log('Uploading translatables for component ' + componentName)

    // Get the repository for this component.
    const repo = this.componentRepos[componentName];

    // All the strings that should be send to weblate.
    let allLanguageComponents = await repo.getTranslatables();


    let files: {[language: string]: {[key: string]: string}} = {};

    allLanguageComponents.forEach((translatable: any) => {
      if(!(translatable.lang in files)) {
        files[translatable.lang] = {};
      }

      switch(translatable.translationState) {
        case 0:
          break;
        case 1:
          // Should be translated, so we remove the old translation.
          // Except if it's the source language, then we have to keep it.
          if(translatable.lang !== MICADO_SOURCE_LANGUAGE) {
            translatable.text = '';
          }
          break;
        case 2:
          // Weblate is still translating this one.
          if(translatable.lang !== MICADO_SOURCE_LANGUAGE) {
            translatable.text = '';
          }
          break;
        case 3:
        case 4:
          // Was already translated but we have to include it because one of the other languages has not been translated yet.
          // Otherwise webplate will think this string has not been translated yet.
          break;
      }

      files[translatable.lang][translatable.id.toString() + '.' + componentName] = translatable.text;
    });

    if(!files.hasOwnProperty(MICADO_SOURCE_LANGUAGE)) {
      // We need atleast an empty file for the source language in weblate.
      files[MICADO_SOURCE_LANGUAGE] = {};
    }



    // Remove previous files in git.
    fs.readdirSync(MICADO_TRANSLATIONS_DIR).filter(
      fn => (fn.startsWith(componentName) && fn.endsWith('.json'))
    ).forEach((filename) => {
      fs.unlinkSync(MICADO_TRANSLATIONS_DIR + '/' + filename);
    });

    // Generate the files on the filesystem and push them to git.
    let results = this.generateFiles(componentName, files);
    let done = await Promise.all(results);
    await this.git.add('-u');
    if(results.length > 0) {
      await this.git.add('./*.json');
    }
    await this.git.commit('New files generated');
    await this.git.push('origin', 'master');

    // Now they are pushed to git, so we update the status to 'translating'.
    // TODO: The fetching of allLanguageComponents and this updating should be done in a transaction.
    repo.updateToTranlating(allLanguageComponents);
   }
   

   private async importTranslatables() {
    for(const componentName in this.componentRepos) {
      await this.importTranslatablesComponent(componentName);
    }
   }
   */

   private async importTranslatablesComponent(componentName: string) {
    if(!this.gitInitialized) {
      console.log('Git is not initalized yet, try again later.');
      return;
    }

    console.log('Importing translations for component "' + componentName + '".');

    const repo = this.componentRepos[componentName];

    let data: {[id: number]: {[language: string]: {[columnName: string]: string}}} = {};

    const files = fs.readdirSync(MICADO_TRANSLATIONS_DIR).filter(fn => (fn.startsWith(componentName) && fn.endsWith('.json')));
    files.forEach((filename) => {
      const [componentNameFromFile, language, extension] = filename.split('.');
      const rawData = fs.readFileSync(MICADO_TRANSLATIONS_DIR + '/' + filename);
      const componentLanguageData = JSON.parse(rawData.toString());
      
      for(let key in componentLanguageData) {
        const dotIndex = key.indexOf('.');
        const id = parseInt(key.substr(0, dotIndex));
        if(!data.hasOwnProperty(id)) {
          data[id] = {};
        }

        data[id][language] = componentLanguageData[key];
      }
    });

    await repo.updateToTranslated(MICADO_SOURCE_LANGUAGE, data);
   }

   private generateFiles(componentName: string, fileDict: any) {
    let promises = [];
    for(const [lang, translations] of Object.entries(fileDict)) {
      promises.push(fsAsync.writeFile(MICADO_TRANSLATIONS_DIR + "/" + componentName + "." + lang + ".json", JSON.stringify(translations)));
    }

    return promises;
  }
}
