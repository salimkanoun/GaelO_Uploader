import { ADD_WARNING_STUDY, REMOVE_WARNING_STUDY, TOOGLE_WARNING_SERIES, ADD_WARNINGS_SERIES } from './actions-types'


/**
 * Add warnings to Redux studies after check
 * @param {String} studyInstanceUID
 * @param {Object} warnings
 */
export function addWarningsStudy (studyInstanceUID, warnings) {
  return {
    type: ADD_WARNING_STUDY,
    payload: { studyInstanceUID: studyInstanceUID, warning: warnings }
  }
}

/**
 * Update Redux passed study warning
 * @param {Object} warningToUpdate
 * @param {String} studyInstanceUID
 */
export function updateWarningStudy (warningKey, studyInstanceUID) {
  return {
    type: REMOVE_WARNING_STUDY,
    payload: { warningKey: warningKey, studyInstanceUID: studyInstanceUID }
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
export function toogleWarningSeries (warningKey, seriesInstanceUID) {
  return {
    type: TOOGLE_WARNING_SERIES,
    payload: { warningKey: warningKey, seriesInstanceUID: seriesInstanceUID }
  }
}
