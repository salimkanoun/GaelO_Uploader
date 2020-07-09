//Gérer les IDs, selected study, warnings
import { SELECT_STUDY, SELECT_SERIES } from '../actions/actions-types'

const initialState = {
    selectedStudy: null,
    selectedSeries: {

    }
}

export default function DisplayTablesReducer(state = initialState, action) {

    switch (action.type) {

        case SELECT_STUDY:
            console.log("study selected")
            console.log(state.selectedStudy)
            return {
                ...state,
                selectedStudy: action.payload
                }

        case SELECT_SERIES:
            return {
                ...state,
                series: { ...state.selectedSeries,
                    [state.selectedStudy]: [action.payload] }
            }

        default:
            return state
    }
}