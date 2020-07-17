import { SELECT_STUDY, SELECT_SERIES, SERIES_READY } from './actions-types'

export function selectStudy (studyID) {
  return {
    type: SELECT_STUDY,
    payload: studyID
  }
}

export function selectSeries (row, isSelect) {
  return {
    type: SELECT_SERIES,
    payload: { row, isSelect }
  }
}

export function validateCheckPatient (id) {
  return {
    type: SELECT_SERIES,
    payload: id
  }
}

export function selectSeriesReady (validSeriesID, isSelect) {
  return {
    type: SERIES_READY,
    payload: { validSeriesID, isSelect }
  }
}
