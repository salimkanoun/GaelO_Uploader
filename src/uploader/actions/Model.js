import { ADD_STUDY, ADD_SERIES, ADD_INSTANCE, ADD_WARNING_SERIES, UPDATE_WARNING_SERIES, UPDATE_WARNING_STUDY } from './actions-types'

export function addStudy(study) {
    return {
        type: ADD_STUDY,
        payload: study
    }
}

export function addSeries(series) {
    return {
        type: ADD_SERIES,
        payload: series
    }
}

export function addInstance(study, series, instance) {
    return {
        type: ADD_INSTANCE,
        payload: {study, series, instance}
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