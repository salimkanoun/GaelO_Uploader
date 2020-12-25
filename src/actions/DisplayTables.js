import { SELECT_STUDY, ADD_SERIES_READY, REMOVE_SERIES_READY, SELECT_SERIES, STUDIES_READY } from './actions-types'

/**
 * Update Redux state of current selectedStudy
 * @param {String} studyInstanceUID
 */
export function selectStudy (studyInstanceUID) {
  return {
    type: SELECT_STUDY,
    payload: studyInstanceUID
  }
}

/**
 * Update Redux state of current selectedSeries
 * @param {String} seriesInstanceUID
 */
export function selectSeries (seriesInstanceUID) {
  return {
    type: SELECT_SERIES,
    payload: seriesInstanceUID
  }
}

/**
 * Update Redux state of selected series which are ready to be uploaded
 * @param {String} validSeriesInstanceUID
 * @param {Boolean} isSelect
 */
export function addSeriesReady ( seriesInstanceUID ) {
  return {
    type: ADD_SERIES_READY,
    payload: { seriesInstanceUID: seriesInstanceUID}
  }
}

export function removeSeriesReady (seriesInstanceUID) {
  return {
    type: REMOVE_SERIES_READY,
    payload: { validSeriesInstanceUID: seriesInstanceUID}
  }
}

/**
 * Update Redux state of selected studies which are ready to be uploaded
 * @param {String} studiesInstanceUID
 * @param {Boolean} isSelect
 */
export function selectStudiesReady (studiesInstanceUID, isSelect) {
  return {
    type: STUDIES_READY,
    payload: { studiesInstanceUID: studiesInstanceUID, isSelect: isSelect }
  }
}
