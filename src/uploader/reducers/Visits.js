import { ADD_VISIT, SET_USED } from '../actions/actions-types'

const initialState = {
  visits: []
}

/* MULTIUPLOAD mode reducer */

export default function VisitsReducer(state = initialState, action) {
  switch (action.type) {
    case ADD_VISIT:
      // Add visit to reducer
      const visitObject = action.payload
      const newVisitArray = []
      newVisitArray.push(...visitObject)
      return {
        ...state,
        visits: newVisitArray
      }

    case SET_USED:
      // Set used state of given visit
      const idVisit = action.payload.idVisit
      const studyID = action.payload.studyID
      const isUsed = action.payload.isUsed
      console.log(action.payload)
      let thisNewVisit = {}
      const newVisitsArray = []
      //Find idVist in state
      for (const thisRow in state.visits) {
        //Once found, save it in thisNewVisit
        if (state.visits[thisRow].idVisit === idVisit) {
          thisNewVisit = state.visits[thisRow]
        } else newVisitsArray.push(state.visits[thisRow]) //Save all the other rows in a new array
      }
      if (isUsed) thisNewVisit.studyID = studyID
      else delete thisNewVisit.studyID
      thisNewVisit.isUsed = isUsed
      newVisitsArray.push(thisNewVisit)
      return {
        ...state,
        visits: [...newVisitsArray]
      }

    default:
      return state
  }
}