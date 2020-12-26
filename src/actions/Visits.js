import { ADD_VISIT, SET_USED_VISIT, SET_NOT_USED_VISIT, RESET_VISITS } from './actions-types'
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
 * @param {Integer} idVisit
 * @param {String} studyID
 * @param {Boolean} isUsed new status of visit
 */
export function setUsedVisit (idVisit, studyID) {
  return {
    type: SET_USED_VISIT,
    payload: { idVisit: idVisit, studyID: studyID}
  }
}

export function setNotUsedVisit(idVisit){
  return {
    type: SET_NOT_USED_VISIT,
    payload: { idVisit: idVisit}
  }
}

export function resetVisits(){
  return {
    type : RESET_VISITS
  }
}
