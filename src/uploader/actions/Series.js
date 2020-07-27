import { ADD_SERIES } from './actions-types'

export function addSeries (series) {
  return {
    type: ADD_SERIES,
    payload: series
  }
}