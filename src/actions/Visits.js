import { ADD_VISIT, RESET_VISITS } from './actions-types'

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

/**
 * Remove all visits in redux, to restart the app (done at new loading of dicoms)
 */
export function resetVisits(){
  return {
    type : RESET_VISITS
  }
}
