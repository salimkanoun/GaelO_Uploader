import { UPDATE_WARNING_OBJECT } from '../actions/actions-types'

const initialState = {
    warning: {}
}

export default function WarningsReducer(state = initialState, action) {

    switch (action.type) {

        case UPDATE_WARNING_OBJECT:
            let warningCopy = action.payload
            warningCopy.dismissed = !warningCopy.dismissed
            return {
                ...state,
                warning: warningCopy
            }

        default:
            return state
    }
}
