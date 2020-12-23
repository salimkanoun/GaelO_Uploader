// Gérer les IDs, selected study, warnings
import { ADD_SERIES } from '../actions/actions-types'

const initialState = {
  series: {}
}

export default function SeriesReducer (state = initialState, action) {
  switch (action.type) {
    
    case ADD_SERIES:
      // Add Series to reducer
      const seriesObject = action.payload
      seriesObject.numberOfInstances = Object.keys(seriesObject.instances).length
      return {
        series: {
          ...state.series,
          [seriesObject.seriesInstanceUID]: { ...seriesObject }
        }
      }

    default:
      return state
  }
}
