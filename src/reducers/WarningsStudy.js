import { REMOVE_WARNING_STUDY, ADD_WARNING_STUDY } from '../actions/actions-types'
import Util from '../model/Util'

const initialState = {
    warningsStudy: {}
}

export default function WarningsStudyReducer(state = initialState, action) {

    let studyInstanceUID

    switch (action.type) {

        case ADD_WARNING_STUDY:
            // Add series warnings to reducer
            let warning = action.payload.warning
            studyInstanceUID = action.payload.studyInstanceUID

            let warningObject = state.warningsStudy[studyInstanceUID] == null ? {} : state.warningsStudy[studyInstanceUID]
            warningObject[warning.key] = {...warning}

            return {
                warningsStudy: {
                    ...state.warningsStudy,
                    [action.payload.studyInstanceUID]: { ...warningObject }
                }
            }

        case REMOVE_WARNING_STUDY:
            // Update given series warning in reducer
            const warningKey = action.payload.warningKey
            studyInstanceUID = action.payload.studyInstanceUID

            let newWarningState = state.warningsStudy
            delete newWarningState[studyInstanceUID][warningKey]

            //If no other warning
            if( Util.isEmptyObject(newWarningState[studyInstanceUID]) ) delete state.warningsStudy[studyInstanceUID]

            return {
                warningsStudy: {
                    ...newWarningState
                }
            }

        default:
            return state
    }
}
