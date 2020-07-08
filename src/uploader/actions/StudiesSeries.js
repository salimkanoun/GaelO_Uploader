import { ADD_SERIES, ADD_WARNING_SERIES, ADD_WARNING_STUDY } from './actions-types'

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