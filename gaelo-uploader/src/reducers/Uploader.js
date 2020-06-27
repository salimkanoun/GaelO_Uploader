import { SELECT_STUDY } from './actions-type'

const initialState = {
    queries: []
}

export default function queryListReducer(state = initialState, action) {

    switch (action.type) {
        case SELECT_STUDY:
            return {
                queries
            }

        default:
            return state
    }

}
