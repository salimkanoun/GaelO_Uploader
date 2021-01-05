/**
 Copyright (C) 2018-2020 KANOUN Salim
 This program is free software; you can redistribute it and/or modify
 it under the terms of the Affero GNU General Public v.3 License as published by
 the Free Software Foundation;
 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 Affero GNU General Public Public for more details.
 You should have received a copy of the Affero GNU General Public Public along
 with this program; if not, write to the Free Software Foundation, Inc.,
 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'

import Row from 'react-bootstrap/Row'

import DisplayStudies from './DisplayStudies.js'
import DisplaySeries from './DisplaySeries.js'
class ControllerStudiesSeries extends Component {

  /**
   * Format studies from Redux State to display in study table
   * @return {array}
   */
  buildStudiesRows() {
    let studies = []
    for (let study of Object.values(this.props.studies) ) {
      study.status = this.getStudyStatus(study.studyInstanceUID)
      study.selectedStudies = this.props.studiesReady.includes(study.studyInstanceUID)
      studies.push({ ...study })
    }
    return studies
  }

  /**
   * Check the study status according to its warnings and its series warnings
   * @param {Object} study
   * @return {Boolean}
   */
  getStudyStatus(studyInstanceUID) {

    if ( this.props.warningsStudies[studyInstanceUID] === undefined ) {
      //If no warning at study level, look if remaining warnings at series level
      let seriesArray = this.getSeriesFromStudy(studyInstanceUID)

      for (let series of seriesArray ) {
        if ( !this.isSeriesWarningsPassed(series.seriesInstanceUID)) {
          return 'Incomplete'
        }
      }
      //If not, study is valid
      return 'Valid'

    } else {
      //If warning at study level return them as string
      if (this.props.warningsStudies[studyInstanceUID]['ALREADY_KNOWN_STUDY'] !== undefined) {
        return 'Already Known'
      }

      if (this.props.warningsStudies[studyInstanceUID]['NULL_VISIT_ID'] !== undefined) {
        return 'Rejected'
      }

    }

  }

  /**
   * Get Series in Redux related to a StudyInstanceUID
   * @param {string} studyInstanceUID 
   */
  getSeriesFromStudy = (studyInstanceUID) => {
      //Read available series in Redux
      let seriesArray = Object.values(this.props.series)
      //Select series belonging to the current study
      let seriesToDisplay = seriesArray.filter((series)=> {
        return series.studyInstanceUID === studyInstanceUID
      })

      return seriesToDisplay
  }

  /**
   * Fetch studies from Redux State to display in Series table
   * @return {Object}
   */
  buildSeriesRows() {
    let seriesArray = []

    if (this.props.selectedStudy !== null) {

      let seriesToDisplay = this.getSeriesFromStudy(this.props.selectedStudy)

      seriesToDisplay.forEach( (series) => {

        series.status = this.isSeriesWarningsPassed(series.seriesInstanceUID) ? 'Valid' : 'Rejected'

        series.selectedSeries = this.props.seriesReady.includes(series.seriesInstanceUID)
        seriesArray.push({
          ...series
        })

      })

    }

    return seriesArray
  }

  /**
   * Check if the series warnings have been all passed
   * @param {Object} series
   * @return {Boolean}
   */
  isSeriesWarningsPassed(series) {
    for (const warning in this.props.warningsSeries[series]) {
      if (!this.props.warningsSeries[series][warning].dismissed) {
        return false
      }
    }
    return true
  }

  render() {
    
    return (
      <div disabled={ !this.props.isCheckDone || this.props.isUploading }>
        <Row>
          <DisplayStudies multiUpload={this.props.multiUpload} studiesRows={this.buildStudiesRows()} />
        </Row>
        <Row>
          <DisplaySeries seriesRows={this.buildSeriesRows()} />
        </Row>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    series: state.Series.series,
    studies: state.Studies.studies,
    seriesReady: state.DisplayTables.seriesReady,
    studiesReady: state.DisplayTables.studiesReady,
    selectedStudy: state.DisplayTables.selectedStudy,
    selectedSeries: state.DisplayTables.selectedSeries,
    warningsSeries: state.Warnings.warningsSeries,
    warningsStudies: state.WarningsStudy.warningsStudy
  }
}


export default connect(mapStateToProps, null)(ControllerStudiesSeries)
