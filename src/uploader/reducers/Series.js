// Gérer les IDs, selected study, warnings
import { ADD_SERIES, UPDATE_WARNING_SERIES } from '../actions/actions-types'

const initialState = {
  series: {}
}

export default function SeriesReducer(state = initialState, action) {
  switch (action.type) {

    case ADD_SERIES:
      //Add Series to reducer
      let seriesObject = action.payload
      seriesObject.numberOfInstances = Object.keys(seriesObject.instances).length
      return {
        ...state,
        series: {
          ...state.series,
          [seriesObject.seriesInstanceUID]: { ...seriesObject }
        }
      }

    case UPDATE_WARNING_SERIES:
      // Ignore warning at series level
      const seriesWarning = action.payload.key
      const seriesID = action.payload.objectID
      //SK : ici structure compliquée, ne serait ce pas mieux dans un reducer de warning?
      return {
        ...state,
        series: {
          ...state.series,
          [seriesID]: {
            ...state.series[seriesID],
            warnings: {
              ...state.series[seriesID].warnings,
              [seriesWarning]: { ...state.series[seriesID].warnings[seriesWarning], dismissed: !state.series[seriesID].warnings[seriesWarning].dismissed }
            }
          }
        }
      }

    default:
      return state
  }
}
