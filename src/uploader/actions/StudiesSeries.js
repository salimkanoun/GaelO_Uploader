import { ADD_STUDY, ADD_SERIES, ADD_WARNING_STUDY, UPDATE_WARNING_STUDY, ATTRIBUTE_ID_VISIT } from './actions-types'

export function addSeries (series) {
  return {
    type: ADD_SERIES,
    payload: series
  }
}

export function addStudy (studyObject) {
  return {
    type: ADD_STUDY,
    payload: studyObject
  }
}

export function addWarningsStudy(studyInstanceUID, warnings) {
  return {
    type: ADD_WARNING_STUDY,
    payload: {studyInstanceUID: studyInstanceUID, warnings: warnings}
  }
}

export function updateWarningStudy(warningToUpdate, studyInstanceUID) {
  return {
      type: UPDATE_WARNING_STUDY,
      payload: {warningToUpdate: warningToUpdate, studyInstanceUID: studyInstanceUID}
  }
}

export function attributeIdVisit(studyInstanceUID, idVisit) {
  return {
    type: ATTRIBUTE_ID_VISIT,
    payload: {studyInstanceUID: studyInstanceUID, idVisit:idVisit}
  }
}