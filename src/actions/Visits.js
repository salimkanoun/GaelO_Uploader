import { ADD_VISIT, RESET_REDUX } from './actions-types'

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

export function resetRedux(){
  return {
    type: RESET_REDUX
  }

}
