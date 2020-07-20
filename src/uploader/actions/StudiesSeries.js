import { ADD_STUDY, ADD_SERIES } from './actions-types'

export function addSeries (series) {
  return {
    type: ADD_SERIES,
    payload: series
  }
}

export function addStudy (studyObject) {
  return {
    type: ADD_STUDY,
    payload: studyObject
  }
}
