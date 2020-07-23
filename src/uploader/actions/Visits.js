import { ADD_VISIT, SET_USED, SET_EXPECTED_VISIT_ID } from './actions-types'

export function addVisit (visitObject) {
  return {
    type: ADD_VISIT,
    payload: visitObject
  }
}

export function setExpectedVisitID(visitID) {
  return {
    type: SET_EXPECTED_VISIT_ID,
    payload: visitID
  }
}

export function setUsedVisit (visitID, isUsed) {
    return {
      type: SET_USED,
      payload: {visitID: visitID, isUsed:isUsed}
    }
  }