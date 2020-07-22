import { UPDATE_WARNING_SERIES, ADD_WARNINGS_SERIES } from './actions-types'

export function addWarningsSeries(seriesInstanceUID, warnings) {
    return {
        type: ADD_WARNINGS_SERIES,
        payload: {seriesInstanceUID : seriesInstanceUID, warnings: warnings}
    }
}

export function updateWarningSeries(warningToUpdate, seriesInstanceUID) {
    return {
        type: UPDATE_WARNING_SERIES,
        payload: {warningToUpdate: warningToUpdate, seriesInstanceUID: seriesInstanceUID}
    }
}