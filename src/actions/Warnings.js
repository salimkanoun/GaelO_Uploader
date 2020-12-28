import { ADD_WARNING_STUDY, UPDATE_WARNING_STUDY, TOOGLE_WARNING_SERIES, ADD_WARNINGS_SERIES } from './actions-types'


/**
 * Add warnings to Redux studies after check
 * @param {String} studyInstanceUID
 * @param {Object} warnings
 */
export function addWarningsStudy (studyInstanceUID, warnings) {
  return {
    type: ADD_WARNING_STUDY,
    payload: { studyInstanceUID: studyInstanceUID, warnings: warnings }
  }
}

/**
 * Update Redux passed study warning
 * @param {Object} warningToUpdate
 * @param {String} studyInstanceUID
 */
export function updateWarningStudy (warningToUpdate, studyInstanceUID) {
  return {
    type: UPDATE_WARNING_STUDY,
    payload: { warningToUpdate: warningToUpdate, studyInstanceUID: studyInstanceUID }
  }
}

/**
 * Add warnings to Redux series
 * @param {String} seriesInstanceUID
 * @param {Object} warnings
 */
export function addWarningsSeries (seriesInstanceUID, warnings) {
  return {
    type: ADD_WARNINGS_SERIES,
    payload: { seriesInstanceUID: seriesInstanceUID, warnings: warnings }
  }
}

/**
 * Update Redux warning of passed seriesID
 * @param {*} warningToUpdate
 * @param {*} seriesInstanceUID
 */
export function toogleWarningSeries (warningToUpdate, seriesInstanceUID) {
  return {
    type: TOOGLE_WARNING_SERIES,
    payload: { warningToUpdate: warningToUpdate, seriesInstanceUID: seriesInstanceUID }
  }
}
