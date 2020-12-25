import { TOOGLE_WARNING_SERIES, ADD_WARNINGS_SERIES } from '../actions/actions-types'

const initialState = {
  warningsSeries: {}
}

export default function WarningsReducer (state = initialState, action) {
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
      const seriesWarning = action.payload.warningToUpdate.key
      const seriesInstanceUID = action.payload.seriesInstanceUID

      let seriesToUpdate = state.warningsSeries[seriesInstanceUID]
      seriesToUpdate[seriesWarning]['dismissed'] = !seriesToUpdate[seriesWarning]['dismissed']

      return {
        warningsSeries: {
          ...state.warningsSeries,
          [seriesInstanceUID]: { ...seriesToUpdate }
        }
      }

    default:
      return state
  }
}
