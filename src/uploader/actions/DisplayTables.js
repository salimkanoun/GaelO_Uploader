import { SELECT_STUDY, SELECT_SERIES, SERIES_READY } from './actions-types'

export function selectStudy (studyInstanceUID) {
  return {
    type: SELECT_STUDY,
    payload: studyInstanceUID
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

export function selectSeriesReady (validSeriesInstanceUID, isSelect) {
  return {
    type: SERIES_READY,
    payload: { validSeriesInstanceUID: validSeriesInstanceUID, isSelect }
  }
}
