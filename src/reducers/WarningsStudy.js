import { UPDATE_WARNING_STUDY, ADD_WARNING_STUDY } from '../actions/actions-types'

const initialState = {
    warningsStudy: {}
}

export default function WarningsStudyReducer(state = initialState, action) {

    let warnings = {}

    switch (action.type) {

        case ADD_WARNING_STUDY:
            // Add series warnings to reducer
            warnings = action.payload.warnings
            return {
                warningsStudy: {
                    ...state.warningsStudy,
                    [action.payload.studyInstanceUID]: { ...warnings }
                }
            }

        case UPDATE_WARNING_STUDY:
            // Update given series warning in reducer
            const warningKey = action.payload.warningKey
            const studyInstanceUID = action.payload.studyInstanceUID
            console.log(warningKey)
            console.log(studyInstanceUID)
            let studyToUpdate = state.warningsStudy[studyInstanceUID]
            studyToUpdate[warningKey]['dismissed'] = !studyToUpdate[warningKey]['dismissed']

            return {
                warningsStudy: {
                    ...state.warningsStudy,
                    [studyInstanceUID]: { ...studyToUpdate }
                }
            }

        default:
            return state
    }
}
