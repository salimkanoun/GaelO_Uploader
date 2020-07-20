import { UPDATE_WARNING_SERIES, VALIDATE_CHECK_PATIENT, UPDATE_WARNING_STUDY, ADD_WARNINGS_SERIES, ADD_WARNINGS_STUDY } from '../actions/actions-types'

const initialState = {
    warningsSeries: {},
    warningsStudies: {}
}

export default function DisplayTablesReducer(state = initialState, action) {
    let warnings = {}
    switch (action.type) {
        case ADD_WARNINGS_SERIES:
            warnings = action.payload.warnings
            return {
                ...state,
                warningsSeries: {
                    ...state.warningsSeries,
                    [action.payload.seriesInstanceUID]: { ...warnings }
                }
            }
        case ADD_WARNINGS_STUDY:
            warnings = action.payload.warnings
            return {
                ...state,
                warningsStudies: {
                    ...state.warningsStudies,
                    [action.payload.studyInstanceUID]: { ...warnings }
                }
            }

        case UPDATE_WARNING_SERIES:
            const seriesWarning = action.payload.warningToUpdate.key
            const seriesInstanceUID = action.payload.seriesInstanceUID
            return {
                ...state,
                warningsSeries: {
                    ...state.warningsSeries,
                    [seriesInstanceUID]: {
                        ...state.warningsSeries[seriesInstanceUID],
                        [seriesWarning]: { ...state.warningsSeries[seriesInstanceUID][seriesWarning], dismissed: !state.warningsSeries[seriesInstanceUID][seriesWarning].dismissed }
                    }
                }
            }

        case UPDATE_WARNING_STUDY:
            const studyWarning = action.payload.warningToUpdate.key
            const studyInstanceUID = action.payload.studyInstanceUID
            return {
                ...state,
                warningsStudies: {
                    ...state.warningsStudies,
                    [studyInstanceUID]: {
                            ...state.warningsStudies[studyInstanceUID],
                            [studyWarning]: { ...state.warningsStudies[studyInstanceUID][studyWarning], dismissed: !state.warningsStudies[studyInstanceUID][studyWarning].dismissed }
                        }
                    }
            }

        case VALIDATE_CHECK_PATIENT: {
            const patientID = action.payload
            return {
                ...state
            }
        }

        default:
            return state
    }
}
