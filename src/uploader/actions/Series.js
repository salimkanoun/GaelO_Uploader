import { ADD_SERIES } from './actions-types'

/**
 * Add series to Redux series Object
 * @param {Object} series 
 */
export function addSeries (series) {
  return {
    type: ADD_SERIES,
    payload: series
  }
}