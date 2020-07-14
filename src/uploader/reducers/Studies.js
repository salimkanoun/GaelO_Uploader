// Gérer les IDs, selected study, warnings
import { ADD_STUDY, UPDATE_WARNING_STUDY, VALIDATE_CHECK_PATIENT,  } from '../actions/actions-types'

const initialState = {
  studies: {}
}

export default function StudiesReducer (state = initialState, action) {
  switch (action.type) {
    case ADD_STUDY:
        let study = action.payload
        return {
            studies : {
                ...state.studies,
                ...study
            }
        }

    case UPDATE_WARNING_STUDY:
      return {
        ...state
      }

    case VALIDATE_CHECK_PATIENT:{
        let patientID = action.payload
        return {
            ...state
        }
    }
    default:
      return state
  }
}
