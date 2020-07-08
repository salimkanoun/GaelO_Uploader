import { ADD_SERIES, ADD_WARNING_SERIES, ADD_WARNING_STUDY, UPDATE_WARNING_SERIES, UPDATE_WARNING_STUDY } from './actions-types'

export function addSeries(studyID, seriesID){
    return {
        type: ADD_SERIES, 
        payload: {studyID, seriesID}
    }
}

export function addWarningSeries(seriesID, warnings){
    return {
        type: ADD_WARNING_SERIES, 
        payload: {seriesID, warnings}
    }
}

export function addWarningStudies(studyID, warnings){
    return {
        type: ADD_WARNING_STUDY, 
        payload: {studyID, warnings}
    }
}

export function updateWarningSeries(warningToUpdate){
    return {
        type: UPDATE_WARNING_SERIES, 
        payload: warningToUpdate
    }
}