import { UPDATE_WARNING_SERIES, VALIDATE_CHECK_PATIENT, UPDATE_WARNING_STUDY, ADD_WARNINGS_SERIES, ADD_WARNINGS_STUDY } from './actions-types'

export function addWarningsSeries(seriesInstanceUID, warnings) {
    return {
        type: ADD_WARNINGS_SERIES,
        payload: {seriesInstanceUID : seriesInstanceUID, warnings: warnings}
    }
}

export function addWarningsStudy(studyInstanceUID, warnings) {
    return {
        type: ADD_WARNINGS_STUDY,
        payload: {studyInstanceUID : studyInstanceUID, warnings: warnings}
    }
}

export function updateWarningSeries(warningToUpdate, seriesInstanceUID) {
    return {
        type: UPDATE_WARNING_SERIES,
        payload: {warningToUpdate: warningToUpdate, seriesInstanceUID: seriesInstanceUID}
    }
}

export function updateWarningStudy(warningToUpdate, studyInstanceUID) {
    return {
        type: UPDATE_WARNING_STUDY,
        payload: {warningToUpdate: warningToUpdate, studyInstanceUID}
    }
}

export function validateCheckPatient(studyInstanceUID) {
    return {
        type: VALIDATE_CHECK_PATIENT,
        payload: studyInstanceUID
    }
}