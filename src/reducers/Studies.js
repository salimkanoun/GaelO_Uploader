import { ADD_STUDY, ADD_WARNING_STUDY, UPDATE_WARNING_STUDY, SET_VISIT_ID } from '../actions/actions-types'

const initialState = {
  studies: {}
}

export default function StudiesReducer (state = initialState, action) {
  
  let studyInstanceUID

  switch (action.type) {
    
    case ADD_STUDY:
      // Add study to reducer
      const studyObject = action.payload
      return {
        studies: {
          ...state.studies,
          [studyObject.studyInstanceUID]: { ...studyObject }
        }
      }

    case ADD_WARNING_STUDY:
      // Add warning to given study in reducer
      studyInstanceUID = action.payload.studyInstanceUID
      const warningsStudy = action.payload.warnings
      return {
        studies: {
          ...state.studies,
          [studyInstanceUID]: { ...state.studies[studyInstanceUID], warnings: { ...warningsStudy } }
        }
      }

    case SET_VISIT_ID:
      // Set idVisit for given study in reducer
      studyInstanceUID = action.payload.studyInstanceUID
      const idVisit = action.payload.idVisit
      return {
        studies: {
          ...state.studies,
          [studyInstanceUID]: { ...state.studies[studyInstanceUID], idVisit: idVisit }
        }
      }

    case UPDATE_WARNING_STUDY:
      // Update given study warning in reducer
      studyInstanceUID = action.payload.studyInstanceUID
      const studyWarning = action.payload.warningToUpdate.key

      let studyToModify = state.studies[studyInstanceUID]
      studyToModify['warnings'][studyWarning]['dismissed'] = !studyToModify['warnings'][studyWarning]['dismissed']
      return {
        studies: {
          ...state.studies,
          [studyInstanceUID]: {...studyToModify}
        }
      }

    default:
      return state
  }
}
