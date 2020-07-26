import { ADD_VISIT, SET_USED } from './actions-types'

export function addVisit (visitObject) {
  return {
    type: ADD_VISIT,
    payload: visitObject
  }
}

export function setUsedVisit (idVisit, studyID, isUsed) {
  return {
    type: SET_USED,
    payload: { idVisit: idVisit, studyID: studyID, isUsed: isUsed }
  }
}
