import { ADD_STUDY, SET_VISIT_ID, UNSET_VISIT_ID } from '../actions/actions-types'

const initialState = {
  studies: {}
}

export default function StudiesReducer(state = initialState, action) {

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

    case SET_VISIT_ID:
      // Set visitID for given study in reducer
      studyInstanceUID = action.payload.studyInstanceUID
      const visitID = action.payload.visitID
      return {
        studies: {
          ...state.studies,
          [studyInstanceUID]: { ...state.studies[studyInstanceUID], visitID: visitID }
        }
      }
    
    case UNSET_VISIT_ID:
      // Set visitID for given study in reducer
      studyInstanceUID = action.payload.studyInstanceUID
      return {
        studies: {
          ...state.studies,
          [studyInstanceUID]: { ...state.studies[studyInstanceUID], visitID: null }
        }
      }

    default:
      return state
  }

}
