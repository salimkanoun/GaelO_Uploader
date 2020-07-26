// Gérer les IDs, selected study, warnings
import { ADD_STUDY, ADD_WARNING_STUDY, UPDATE_WARNING_STUDY, ATTRIBUTE_ID_VISIT, SET_EXPECTED_VISIT_ID } from '../actions/actions-types'

const initialState = {
  studies: {}
}

export default function StudiesReducer (state = initialState, action) {
  let studyInstanceUID
  switch (action.type) {
    case ADD_STUDY:
      const studyObject = action.payload
      return {
        studies: {
          ...state.studies,
          [studyObject.studyInstanceUID]: { ...studyObject }
        }
      }

    case ADD_WARNING_STUDY:
      studyInstanceUID = action.payload.studyInstanceUID
      const warningsStudy = action.payload.warnings
      return {
        studies: {
          ...state.studies,
          [studyInstanceUID]: { ...state.studies[studyInstanceUID], warnings: { ...warningsStudy } }
        }
      }

    case SET_EXPECTED_VISIT_ID:
      studyInstanceUID = action.payload.studyInstanceUID
      let visitID = action.payload.visitID

      return {
        studies: {
          ...state.studies,
          [studyInstanceUID]: { ...state.studies[studyInstanceUID], visitID: visitID }
        }
      }

    case UPDATE_WARNING_STUDY:
      studyInstanceUID = action.payload.studyInstanceUID
      const studyWarning = action.payload.warningToUpdate.key
      return {
        ...state,
        studies: {
          ...state.studies,
          [studyInstanceUID]: {
            ...state.studies[studyInstanceUID],
            warnings: {
              ...state.studies[studyInstanceUID].warnings,
              [studyWarning]: {
                ...state.studies[studyInstanceUID].warnings[studyWarning],
                dismissed: !state.studies[studyInstanceUID].warnings[studyWarning].dismissed
              }
            }
          }
        }
      }

    case ATTRIBUTE_ID_VISIT:
      const idVisit = action.payload.idVisit
      studyInstanceUID = action.payload.studyInstanceUID
      return {
        ...state,
        studies: {
          ...state.studies,
          [studyInstanceUID]: {
            ...state.studies[studyInstanceUID],
            warnings: {
              ...state.studies[studyInstanceUID].warnings,
              NOT_EXPECTED_VISIT: {
                ...state.studies[studyInstanceUID].warnings.NOT_EXPECTED_VISIT,
                idVisit: idVisit
              }
            }
          }
        }
      }
    default:
      return state
  }
}

// Manage study warnings here
// Add expected data
// IsValidatedPatient
// VisitID
// IsKnownFromServer
