import { repository } from '@loopback/repository';
import { get, param } from '@loopback/rest';
import { EventTranslationProdRepository, InformationTranslationProdRepository, ProcessTranslationProdRepository } from '../repositories';

// Based on this POC: https://github.com/codeurjc/poc-full-text-search/tree/pgroonga
export class SearchController {
  constructor(
    @repository(EventTranslationProdRepository)
    public eventRepository: EventTranslationProdRepository,
    @repository(InformationTranslationProdRepository)
    public informationRepository: InformationTranslationProdRepository,
    @repository(ProcessTranslationProdRepository)
    public processRepository: ProcessTranslationProdRepository
  ) { }

  // private SEARCH_QUERY = `
  //   SELECT 
  //       id, %title%, description, lang,
  //       pgroonga_score(tableoid, ctid) AS score,
  //       pgroonga_snippet_html(%title%, ARRAY%search_context%) AS title_context,
  //       pgroonga_snippet_html(description, ARRAY%search_context%) AS description_context
  //   FROM %table%
  //   WHERE lang=$1 AND ARRAY[%title%, description] &@~ ('%search%', ARRAY[2, 1], '%table%_pgroonga_index')::pgroonga_full_text_search_condition
  //   ORDER BY score DESC;
  // `.replace(/\n|\r/g, ' '); // Replace new line chars with a single white space

  private SEARCH_QUERY = `
  SELECT 
      id,
      pgroonga_score(tableoid, ctid) AS score
  FROM %table%
  WHERE lang=$1 AND ARRAY[%title%, description] &@~ ($2, ARRAY[2, 1], '%table%_pgroonga_index')::pgroonga_full_text_search_condition
  ORDER BY score DESC;
`.replace(/\n|\r/g, ' '); // Replace new line chars with a single white space

  @get('/search', {
    responses: {
      '200': {
        description: 'Search in events, information and processes powered by PGroonga'
      },
    },
  })
  async search(
    @param.query.string('lang') lang = 'en',
    @param.query.string('words') words: string
  ) {
    let search = ""
    if (!words) {
      throw {
        status: 400,
        message: "Please include text in the words query parameter"
      }
    }
    const wordsToSearch = words.split(',')
    // Append the terms to search with OR operator
    wordsToSearch.forEach((word, index, array) => {
      search += word;
      if (index !== (array.length - 1)) {
        search += " OR ";
      }
    })
    let queryEvents = this.SEARCH_QUERY
      .split("%table%").join("event_translation_prod")
      .split("%title%").join("event")
    let queryInfo = this.SEARCH_QUERY
      .split("%table%").join("information_translation_prod")
      .split("%title%").join("information")
    let queryProcesses = this.SEARCH_QUERY
      .split("%table%").join("process_translation_prod")
      .split("%title%").join("process")
    let results = await Promise.all([
      this.eventRepository.dataSource.execute(queryEvents, [lang, search]),
      this.informationRepository.dataSource.execute(queryInfo, [lang, search]),
      this.processRepository.dataSource.execute(queryProcesses, [lang, search])
    ])
    return {
      "events": results[0],
      "information": results[1],
      "processes": results[2]
    }
  }
}