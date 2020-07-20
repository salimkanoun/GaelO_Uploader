// Gérer les IDs, selected study, warnings
import { ADD_STUDY } from '../actions/actions-types'

const initialState = {
  studies: {}
}

export default function StudiesReducer (state = initialState, action) {
  switch (action.type) {
    
    case ADD_STUDY:
      const study = action.payload
      return {
        studies: {
          ...state.studies,
          ...study
        }
      }

    default:
      return state
  }
}
