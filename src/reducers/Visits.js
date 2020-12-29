import { ADD_VISIT, SET_USED_VISIT, SET_NOT_USED_VISIT, RESET_VISITS } from '../actions/actions-types'

const initialState = {
  visits: {}
}

//SK studyID à remplacer par StudyInstanceUID
export default function VisitsReducer (state = initialState, action) {
  switch (action.type) {

    case ADD_VISIT:
      // Add visit to reducer
      const visitObject = action.payload
      return {
        visits: {
          ...state.visits,
          [visitObject.idVisit] : {...visitObject}
        }
      }

    case SET_USED_VISIT:

      // Set used state of given visit
      const idVisit = action.payload.idVisit
      const studyInstanceUID = action.payload.studyInstanceUID
      
      return {
        visits: {
          ...state.visits,
          [idVisit] : {
            ...state.visits[idVisit], 
            studyInstanceUID : studyInstanceUID
          }
        }
      }
    
    case SET_NOT_USED_VISIT:
      const idVisit2 = action.payload.idVisit

      return {
        visits: {
          ...state.visits,
          [idVisit2] : {
            ...state.visits[idVisit2], 
            studyInstanceUID : undefined
          }
        }
      }
    
    case RESET_VISITS:
      return {
        visits: {}
      }

    default:
      return state
  }
}
