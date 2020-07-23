// Gérer les IDs, selected study, warnings
import { ADD_STUDY, ADD_WARNING_STUDY, UPDATE_WARNING_STUDY, CHECK_PATIENT_DATA } from '../actions/actions-types'

const initialState = {
  studies: {}
}

export default function StudiesReducer(state = initialState, action) {
  let studyInstanceUID
  switch (action.type) {

    case ADD_STUDY:
      let studyObject = action.payload
      return {
        studies: {
          ...state.studies,
          [studyObject.studyInstanceUID]: { ...studyObject }
        }
      }

    case ADD_WARNING_STUDY:
      studyInstanceUID = action.payload.studyInstanceUID
      let warningsStudy = action.payload.warnings
      return {
        studies: {
          ...state.studies,
          [studyInstanceUID]: { ...state.studies[studyInstanceUID], warnings: { ...warningsStudy } }
        }
      }

    case UPDATE_WARNING_STUDY:
      studyInstanceUID = action.payload.studyInstanceUID
      let studyWarning = action.payload.warningToUpdate.key
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


    /*case VALIDATE_CHECK_PATIENT: {
        let studyInstanceUID = action.payload
        let newWarningsStudies = state.warningsStudies
        console.log(studyInstanceUID)
        newWarningsStudies[studyInstanceUID]['NOT_EXPECTED_VISIT'].dismissed = true
        return {
            ...state,
            warningsStudies: { ...newWarningsStudies },
        }
    }*/

    default:
      return state
  }
}

//Manage study warnings here
//Add expected data
//IsValidatedPatient
//VisitID
//IsKnownFromServer