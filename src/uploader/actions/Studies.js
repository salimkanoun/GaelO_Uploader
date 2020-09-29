import { ADD_STUDY, ADD_WARNING_STUDY, UPDATE_WARNING_STUDY, SET_VISIT_ID } from './actions-types'

/**
 * Add study to Redux studies Object
 * @param {Object} studyObject
 */
export function addStudy (studyObject) {
  return {
    type: ADD_STUDY,
    payload: studyObject
  }
}

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
 * MULTIUPLOAD mode function only
 * Set idVisit to the passed study awaiting check
 * @param {String} studyInstanceUID
 * @param {Integer} idVisit
 */
export function setVisitID (studyInstanceUID, idVisit) {
  return {
    type: SET_VISIT_ID,
    payload: {
      studyInstanceUID: studyInstanceUID,
      idVisit: idVisit
    }
  }
}
