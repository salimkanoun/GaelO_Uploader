import { ADD_VISIT, SET_USED_VISIT, SET_NOT_USED_VISIT } from '../actions/actions-types'

const initialState = {
  visits: {}
}

export default function VisitsReducer(state = initialState, action) {

  switch (action.type) {

    case ADD_VISIT:
      // Add visit to reducer
      const visitObject = action.payload
      return {
        visits: {
          ...state.visits,
          [visitObject.visitID]: { ...visitObject }
        }
      }

    case SET_USED_VISIT:
      const visitID = action.payload.visitID
      // Set used state of given visit
      const studyInstanceUID = action.payload.studyInstanceUID

      return {
        visits: {
          ...state.visits,
          [visitID]: {
            ...state.visits[visitID],
            studyInstanceUID: studyInstanceUID
          }
        }
      }

    case SET_NOT_USED_VISIT:
      const visitID2 = action.payload.visitID

      return {
        visits: {
          ...state.visits,
          [visitID2]: {
            ...state.visits[visitID2],
            studyInstanceUID: undefined
          }
        }
      }

    default:
      return state
  }
}
