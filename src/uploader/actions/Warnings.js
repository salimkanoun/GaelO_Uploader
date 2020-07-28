import { UPDATE_WARNING_SERIES, ADD_WARNINGS_SERIES } from './actions-types'

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
export function updateWarningSeries (warningToUpdate, seriesInstanceUID) {
  return {
    type: UPDATE_WARNING_SERIES,
    payload: { warningToUpdate: warningToUpdate, seriesInstanceUID: seriesInstanceUID }
  }
}