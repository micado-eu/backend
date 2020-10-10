import {bind, /* inject, */ BindingScope, DefaultConfigurationResolver} from '@loopback/core';
import {promises as fsAsync} from 'fs';
import fs from 'fs';
import simpleGit, {ResetMode, SimpleGit} from 'simple-git';
import { createEmptyApiSpec } from '@loopback/rest';
import { TopicTranslationRepository } from '../repositories';
import {repository} from '@loopback/repository';


// Should come from a config file or the database.
const SOURCE_LANGUAGE = process.env.SOURCE_LANGUAGE || 'en';
const GIT_REPO = process.env.GIT_REPO || '';
const REPO_PATH = '/tmp/translations-repo';

let gitInitialized: boolean = false;


if(!fs.existsSync(REPO_PATH)){
  fs.mkdirSync(REPO_PATH);
}

const git = simpleGit(REPO_PATH);

if(GIT_REPO === '') {
  console.log('GIT_REPO environment variable is not set, this is required for the translation service to work.');
}

git.checkIsRepo()
.then((isRepo) => {
  if(!isRepo) {
    return git.clone(GIT_REPO, '.')
      .then(() => {
        return git.pull('origin', 'master');
      })
      .then(() => {
        return git.addConfig('user.name', 'backend');
      })
      .then(() => {
        return git.addConfig('user.email', 'backend@backend.backend')
      });
  }
})
.then(() => {
  gitInitialized = true;
})
.catch((reason) => {
  console.log('Could not initialize git: ', reason);
});

@bind({scope: BindingScope.TRANSIENT})
export class TranslationService {
  private componentRepos: {[componentName: string]: any}; // Any now but should be an interface that all repos inherit from.

  constructor(
    @repository(TopicTranslationRepository) public topicTranslationRepository: TopicTranslationRepository
  ) {
    // Map component names to their repos. TODO: should be done automatically.
    this.componentRepos = {'topic': this.topicTranslationRepository};
  }

   public async uploadTranslatables() {
     this.uploadTranslatablesComponent('topic');
   }

   private async uploadTranslatablesComponent(componentName: string) {
    if(!gitInitialized) {
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
          if(translatable.lang !== SOURCE_LANGUAGE) {
            translatable.text = '';
          }
          break;
        case 2:
          // Weblate is still translating this one.
          break;
        case 3:
        case 4:
          // Was already translated but we have to include it because one of the other languages has not been translated yet.
          // Otherwise webplate will think this string has not been translated yet.
          break;
      }

      files[translatable.lang][translatable.id.toString() + '.' + componentName] = translatable.text;
    });

    if(!files.hasOwnProperty(SOURCE_LANGUAGE)) {
      // We need atleast an empty file for the source language in weblate.
      files[SOURCE_LANGUAGE] = {};
    }



    // Remove previous files in git.
    fs.readdirSync(REPO_PATH).filter(
      fn => (fn.startsWith(componentName) && fn.endsWith('.json'))
    ).forEach((filename) => {
      fs.unlinkSync(REPO_PATH + '/' + filename);
    });

    // Generate the files on the filesystem and push them to git.
    let results = this.generateFiles(files);
    let done = await Promise.all(results);
    await git.add('-u');
    if(results.length > 0) {
      await git.add('./*.json');
    }
    await git.commit('New files generated');
    await git.push('origin', 'master');

    // Now they are pushed to git, so we update the status to 'translating'.
    // TODO: The fetching of allLanguageComponents and this updating should be done in a transaction.
    repo.updateToTranlating(allLanguageComponents);
   }

   private async importTranslatables() {
    for(const componentName in this.componentRepos) {
      await this.importTranslatablesComponent(componentName);
    }
   }

   private async importTranslatablesComponent(componentName: string) {
    if(!gitInitialized) {
      console.log('Git is not initalized yet, try again later.');
      return;
    }

    // Reset our state to the remote. So we have less chance on a merge conflict.
    await git.fetch('origin');
    await git.reset(ResetMode.HARD);
    await git.pull('origin', 'master');

    console.log('Importing translations for component "' + componentName + '".');

    const repo = this.componentRepos[componentName];

    let data: {[id: number]: {[language: string]: string}} = {};

    const files = fs.readdirSync(REPO_PATH).filter(fn => (fn.startsWith(componentName) && fn.endsWith('.json')));
    files.forEach((filename) => {
      const [componentNameFromFile, language, extension] = filename.split('.');
      const rawData = fs.readFileSync(REPO_PATH + '/' + filename);
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

    await repo.updateToTranslated(data);
   }

   private generateFiles(fileDict: any) {
    let promises = [];
    for(const [lang, translations] of Object.entries(fileDict)) {
      promises.push(fsAsync.writeFile(REPO_PATH + "/topic." + lang + ".json", JSON.stringify(translations)));
    }

    return promises;
  }
}