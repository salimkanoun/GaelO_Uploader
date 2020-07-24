import { ADD_VISIT, SET_USED, SET_EXPECTED_VISIT_ID } from '../actions/actions-types'

const initialState = {
  visits: [],
  expectedVisitID: undefined
}

export default function VisitsReducer(state = initialState, action) {
  switch (action.type) {

    case ADD_VISIT:
      let visitObject = action.payload
      let newVisitArray = []
      newVisitArray.push(...visitObject)
      return {
        ...state,
        visits: newVisitArray
      }

    case SET_EXPECTED_VISIT_ID:
      return {
        ...state,
        expectedVisitID: action.payload
      }

    case SET_USED:
      let idVisit = action.payload.idVisit
      let studyID = action.payload.studyID
      let isUsed = action.payload.isUsed
      console.log(action.payload)
      let thisNewVisit = {} 
      let newVisitsArray = []
      for(let thisRow in state.visits) {
        if (state.visits[thisRow].idVisit === idVisit) {
          thisNewVisit = state.visits[thisRow]
        } else newVisitsArray.push(state.visits[thisRow])
      }
      (isUsed) ? thisNewVisit['studyID'] = studyID : delete thisNewVisit.studyID
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