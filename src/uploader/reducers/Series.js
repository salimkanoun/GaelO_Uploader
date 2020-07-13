// Gérer les IDs, selected study, warnings
import { ADD_SERIES, UPDATE_WARNING_SERIES } from '../actions/actions-types'

const initialState = {
  series: {}
}

export default function SeriesReducer (state = initialState, action) {
  switch (action.type) {
    //Ajouter une series au reducer
    case ADD_SERIES:
        let seriesObject = action.payload
        seriesObject['numberOfInstances'] = Object.keys(seriesObject.instances).length
        return {
            ...state,
            series : {
                ...state.series,
                [seriesObject.seriesInstanceUID] : {...seriesObject}
            }
        }

    //Ignore warning at series level
    case UPDATE_WARNING_SERIES:
      let seriesWarning = action.payload.key
      let seriesID = action.payload.objectID
        return{
            ...state,
            series : {
              ...state.series,
              [seriesID] : {
                ...state.series[seriesID],
                warnings : {
                  ...state.series[seriesID].warnings,
                  [seriesWarning]: { ...state.series[seriesID].warnings[seriesWarning], dismissed: !state.series[seriesID].warnings[seriesWarning].dismissed}
                }
              }
            }
        }

    default:
      return state
  }
}
