// Gérer les IDs, selected study, warnings
import { ADD_STUDY } from '../actions/actions-types'

const initialState = {
  studies: {}
}

export default function StudiesReducer (state = initialState, action) {
  switch (action.type) {
    
    case ADD_STUDY:
      let studyObject = action.payload
      return {
        studies: {
          ...state.studies,
          [studyObject.studyInstanceUID]: {...studyObject}
        }
      }

    default:
      return state
  }
}
