import { ADD_STUDY, ADD_WARNING_STUDY, UPDATE_WARNING_STUDY, SET_VISIT_ID } from './actions-types'

export function addStudy(studyObject) {
  return {
    type: ADD_STUDY,
    payload: studyObject
  }
}

export function setVisitID(studyInstanceUID, idVisit) {
  return {
    type: SET_VISIT_ID,
    payload: {
      studyInstanceUID: studyInstanceUID,
      idVisit: idVisit
    }
  }
}

export function addWarningsStudy(studyInstanceUID, warnings) {
  return {
    type: ADD_WARNING_STUDY,
    payload: { studyInstanceUID: studyInstanceUID, warnings: warnings }
  }
}

export function updateWarningStudy(warningToUpdate, studyInstanceUID) {
  return {
    type: UPDATE_WARNING_STUDY,
    payload: { warningToUpdate: warningToUpdate, studyInstanceUID: studyInstanceUID }
  }
}