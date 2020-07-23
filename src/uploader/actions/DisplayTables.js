import { SELECT_STUDY, SERIES_READY , SELECT_SERIES, STUDIES_READY } from './actions-types'

export function selectStudy (studyInstanceUID) {
  return {
    type: SELECT_STUDY,
    payload: studyInstanceUID
  }
}

export function selectSeries (seriesInstanceUID) {
  return {
    type: SELECT_SERIES,
    payload: seriesInstanceUID
  }
}

export function selectSeriesReady (validSeriesInstanceUID, isSelect) {
  return {
    type: SERIES_READY,
    payload: { validSeriesInstanceUID: validSeriesInstanceUID, isSelect: isSelect }
  }
}

export function selectStudiesReady (validStudiesInstanceUID, isSelect) {
  return {
    type: STUDIES_READY,
    payload: { validStudiesInstanceUID: validStudiesInstanceUID, isSelect: isSelect }
  }
}
