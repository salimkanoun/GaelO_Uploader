import { SELECT_STUDY, SELECT_SERIES } from './actions-types'

export function selectStudy (studyID) {
  return {
    type: SELECT_STUDY,
    payload: studyID
  }
}

export function selectSeries (row, isSelected) {
  return {
    type: SELECT_SERIES,
    payload: { row, isSelected }
  }
}

export function validateCheckPatient(id){
  return {
    type : SELECT_SERIES,
    payload : id
  }
}
