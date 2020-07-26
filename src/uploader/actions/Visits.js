import { ADD_VISIT, SET_USED, SET_EXPECTED_VISIT_ID } from './actions-types'

export function addVisit (visitObject) {
  return {
    type: ADD_VISIT,
    payload: visitObject
  }
}

export function setExpectedVisitID (idVisit) {
  return {
    type: SET_EXPECTED_VISIT_ID,
    payload: idVisit
  }
}

export function setUsedVisit (idVisit, studyID, isUsed) {
  return {
    type: SET_USED,
    payload: { idVisit: idVisit, studyID: studyID, isUsed: isUsed }
  }
}
