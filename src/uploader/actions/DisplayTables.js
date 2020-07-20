import { SELECT_STUDY, SERIES_READY } from './actions-types'

export function selectStudy (studyInstanceUID) {
  return {
    type: SELECT_STUDY,
    payload: studyInstanceUID
  }
}

export function selectSeriesReady (validSeriesInstanceUID, isSelect) {
  return {
    type: SERIES_READY,
    payload: { validSeriesInstanceUID: validSeriesInstanceUID, isSelect: isSelect }
  }
}
