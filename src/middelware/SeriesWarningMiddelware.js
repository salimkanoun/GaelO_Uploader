import { TOOGLE_WARNING_SERIES,ADD_SERIES_READY, REMOVE_SERIES_READY } from '../actions/actions-types'

const seriesWaringMiddleWare = store => next => action => {
    next(action)
    //For Series warning event, mark series ready if no remaining warning
    //Remove series ready if reactivation of warning
    if (action.type === TOOGLE_WARNING_SERIES) {
        const seriesInstanceUID = action.payload.seriesInstanceUID
        const state = store.getState()
        const seriesWarnings = state.Warnings.warningsSeries[seriesInstanceUID]
        if(isSeriesWarningsPassed(seriesWarnings)){
            store.dispatch({
                type: ADD_SERIES_READY,
                payload: { seriesInstanceUID: seriesInstanceUID}
            })
        }else{
            if( state.DisplayTables.seriesReady.includes(seriesInstanceUID) ) {
                store.dispatch({
                    type: REMOVE_SERIES_READY,
                    payload: { seriesInstanceUID: seriesInstanceUID}
                })
            }
        }
    }

}

const isSeriesWarningsPassed = (seriesWarning) => {
    for (const warning of Object.values(seriesWarning)) {
        if (!warning.dismissed) {
            return false
        }
    }
    return true
}

export default seriesWaringMiddleWare