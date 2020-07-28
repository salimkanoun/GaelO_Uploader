import { ADD_VISIT, SET_USED } from './actions-types'
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

/**
 * Update Redux passed visit status
 * @param {String} idVisit 
 * @param {String} studyID 
 * @param {Boolean} isUsed new status of visit 
 */
export function setUsedVisit (idVisit, studyID, isUsed) {
  return {
    type: SET_USED,
    payload: { idVisit: idVisit, studyID: studyID, isUsed: isUsed }
  }
}