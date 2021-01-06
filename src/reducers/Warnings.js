import { TOOGLE_WARNING_SERIES, ADD_WARNINGS_SERIES } from '../actions/actions-types'

const initialState = {
  warningsSeries: {}
}

export default function WarningsReducer(state = initialState, action) {
  
  let warnings = {}
  switch (action.type) {

    case ADD_WARNINGS_SERIES:
      // Add series warnings to reducer
      warnings = action.payload.warnings
      return {
        warningsSeries: {
          ...state.warningsSeries,
          [action.payload.seriesInstanceUID]: { ...warnings }
        }
      }


    case TOOGLE_WARNING_SERIES:
      // Update given series warning in reducer
      const warningKey = action.payload.warningKey
      const seriesInstanceUID = action.payload.seriesInstanceUID

      let seriesToUpdateCopy = JSON.parse(JSON.stringify(state.warningsSeries[seriesInstanceUID]))
      seriesToUpdateCopy[warningKey]['dismissed'] = !seriesToUpdateCopy[warningKey]['dismissed']

      return {
        warningsSeries: {
          ...state.warningsSeries,
          [seriesInstanceUID]: { ...seriesToUpdateCopy }
        }
      }

    default:
      return state
  }
}
