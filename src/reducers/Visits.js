import { ADD_VISIT, SET_USED_VISIT, SET_NOT_USED_VISIT } from '../actions/actions-types'

const initialState = {
  visits: []
}

/* MULTIUPLOAD mode reducer */
export default function VisitsReducer (state = initialState, action) {
  switch (action.type) {

    case ADD_VISIT:
      // Add visit to reducer
      const visitsArray = action.payload
      return {
        visits: visitsArray
      }

    case SET_USED_VISIT:
      // Set used state of given visit
      const idVisit = action.payload.idVisit
      const studyID = action.payload.studyID

      // Find the idVist in state and update his attached StudyInstanceUID and used status
      let newVisitsArray = state.visits.map( (visit) => {
        if(visit.idVisit === idVisit){
          visit.studyID = studyID
          visit.isUsed = true
        }

        return visit
      })

      return {
        visits: newVisitsArray
      }
    
    case SET_NOT_USED_VISIT:
      const idVisit2 = action.payload.idVisit

      // Find the idVist in state and update his attached StudyInstanceUID and used status
      let newVisitsArray2 = state.visits.map( (visit) => {
        if(visit.idVisit === idVisit2){
          delete visit.studyID
          visit.isUsed = false
        }
        return visit
      })

      return {
        visits: newVisitsArray2
      }

    default:
      return state
  }
}
