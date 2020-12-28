import { ADD_VISIT, RESET_VISITS } from './actions-types'
/* MULTIUPLOAD mode functions */

/**
 * Add visit to Redux visits Object
 * @param {Object} visitObject
 */
export function addVisit (visitObject) {
  return {
    type: ADD_VISIT,
    payload: visitObject
  }
}

export function resetVisits(){
  return {
    type : RESET_VISITS
  }
}
