import { TOOGLE_WARNING_SERIES, ADD_WARNINGS_SERIES } from './actions-types'

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
