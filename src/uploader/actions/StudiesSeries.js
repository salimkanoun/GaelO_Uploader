import { ADD_STUDY, ADD_SERIES, ADD_WARNING_SERIES, UPDATE_WARNING_SERIES, VALIDATE_CHECK_PATIENT, UPDATE_WARNING_STUDY } from './actions-types'

export function addSeries (series) {
  return {
    type: ADD_SERIES,
    payload: series
  }
}

export function addWarningSeries (warningsToAdd) {
  return {
    type: ADD_WARNING_SERIES,
    payload: warningsToAdd
  }
}

export function updateWarningSeries (warningToUpdate) {
  return {
    type: UPDATE_WARNING_SERIES,
    payload: warningToUpdate
  }
}

export function addStudy(studyObject){
  return {
    type: ADD_STUDY,
    payload: studyObject
  }
}

export function updateWarningStudy(warningObject){
  return {
    type : UPDATE_WARNING_STUDY,
    payload : warningObject
  }
}

export function validateCheckPatient(patientID){
  return {
    type : VALIDATE_CHECK_PATIENT,
    payload : patientID
  }
}