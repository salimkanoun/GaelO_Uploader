import { ADD_VISIT, SET_USED, SET_EXPECTED_VISIT_ID } from '../actions/actions-types'

const initialState = {
  visits: [],
  expectedVisitID: undefined
}

export default function VisitsReducer(state = initialState, action) {
  switch (action.type) {

    case ADD_VISIT:
      let visitObject = action.payload
      return {
        ...state,
        visits: visitObject
      }

    case SET_EXPECTED_VISIT_ID:
      return {
        ...state,
        expectedVisitID: action.payload
      }

    case SET_USED:
      let isUsed = action.payload.isUsed
      let visitID = action.payload.visitID
      let index
      for (let visit in state.visits) {
        if (state.visits[visit].idVisit === visitID) index = visit
      }
      let thisNewVisit = state.visits[index]
      thisNewVisit.isUsed = isUsed
      let newVisits = state.visits.filter(thisRowID => thisRowID !== index)
      newVisits.push(thisNewVisit)
      return {
        ...state,
        visits: [newVisits]
      }

    default:
      return state
  }
}