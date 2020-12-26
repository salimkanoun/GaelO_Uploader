import { ADD_VISIT, SET_USED_VISIT, SET_NOT_USED_VISIT, RESET_VISITS } from '../actions/actions-types'

const initialState = {
  visits: {}
}

//SK studyID à remplacer par StudyInstanceUID

/* MULTIUPLOAD mode reducer */
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
      const studyID = action.payload.studyID

      return {
        visits: {
          ...state.visits,
          [idVisit] : {
            ...state.visits[idVisit], 
            studyID : studyID
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
            studyID : undefined
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
