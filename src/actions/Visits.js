import { ADD_VISIT } from './actions-types'

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
