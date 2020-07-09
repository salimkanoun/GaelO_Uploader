import { ADD_STUDIES_SERIES, ADD_WARNING_SERIES, UPDATE_WARNING_SERIES, UPDATE_WARNING_STUDY } from './actions-types'

export function addStudiesSeries(studies) {
    return {
        type: ADD_STUDIES_SERIES,
        payload: studies
    }
}

export function addWarningSeries(warningsToAdd) {
    return {
        type: ADD_WARNING_SERIES,
        payload: warningsToAdd
    }
}

export function updateWarningSeries(warningToUpdate) {
    return {
        type: UPDATE_WARNING_SERIES,
        payload: warningToUpdate
    }
}