//Gérer les IDs, selected study, warnings
import { ADD_SERIES, ADD_WARNING_STUDY, ADD_WARNING_SERIES } from '../actions/actions-types'

const initialState = {
    studies: {
    },
    series: {
    }
}

export default function StudiesSeriesReducer(state = initialState, action) {

    switch (action.type) {

        case ADD_SERIES:
            let seriesIDCopy = action.payload.seriesID
            let studyIDCopy = action.payload.studyID
            console.log(state.studies)
            console.log(state.series)
            if(state.studies[studyIDCopy] !== undefined) {
                return {
                    ...state,
                    studies: {
                        ...state.studies,
                        [studyIDCopy]: [...state.studies[studyIDCopy], seriesIDCopy]
                        },
                    series: { ...state.series, seriesIDCopy }
                }
            } else {
                return {
                    ...state,
                    studies: {
                        ...state.studies,
                        [studyIDCopy]: [ seriesIDCopy]
                        },
                    series: { ...state.series, seriesIDCopy }
                }
            }

        case ADD_WARNING_SERIES:
            let seriesID = action.payload.seriesID
            let seriesWarnings = action.payload.warnings
            

        default:
            return state
    }
}