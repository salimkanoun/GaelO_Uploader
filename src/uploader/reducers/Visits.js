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
      let isUsed = action.payload.isUsed
      let visitID = action.payload.visitID
      let studyID = action.payload.studyID
      console.log(typeof state.visits)
      let thisNewVisit = state.visits.filter(thisRowID => thisRowID.idVisit !== visitID)
      (isUsed) ? thisNewVisit.studyID = [studyID] : delete thisNewVisit.studyID
      let newVisits = state.visits.filter(thisRowID => thisRowID.idVisit !== visitID)
      newVisits.push(thisNewVisit)
      return {
        ...state,
        visits: [...newVisits]
      }

    default:
      return state
  }
}