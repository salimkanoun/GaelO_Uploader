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
   * Fetch studies from Redux State to display in table
   * @return {Object}
   */
  buildStudiesRows() {
    const studies = []
    if (Object.keys(this.props.studies).length > 0) {
      for (const study in this.props.studies) {
        const tempStudy = this.props.studies[study]
        tempStudy.status = this.studyWarningsPassed(study)
        tempStudy.selectedStudies = this.props.studiesReady.includes(tempStudy.studyInstanceUID)
        studies.push({ ...tempStudy })
      }
    }
    return studies
  }

  /**
   * Check the study status according to its warnings and its series warnings
   * @param {Object} study
   * @return {Boolean}
   */
  studyWarningsPassed(study) {

    if( this.props.warningsStudies[study] === undefined) {

      for( let seriesInstanceUID of  this.props.studies[study].series){
        if( ! this.IsSeriesWarningsPassed(seriesInstanceUID)) {
          return 'Incomplete'
        }
      }
      return 'Valid'

    } else {

      if(this.props.warningsStudies[study]['ALREADY_KNOWN_STUDY'] !== undefined){
        return 'Already Known'
      }

      // Check for not dissmissed warnings in study
      for (const warning of Object.values(this.props.warningsStudies[study])) {
        if (!warning.dismissed) {
          return 'Rejected'
        }
      }

    }

  }

  /**
   * Add status and selection state to previous information from the selected study's series
   * in order to build series table
   * @return {Array}
   */
  buildSeriesRows() {
    const seriesArray = []
    if (this.props.selectedStudy !== null && this.props.selectedStudy !== undefined) {

      let studyInstanceUID = this.props.selectedStudy
      const seriesToDisplay = this.props.studies[studyInstanceUID].series

      seriesToDisplay.forEach((seriesInstanceUID) => {

        let seriesToPush = this.props.series[seriesInstanceUID]
        seriesToPush.status = this.IsSeriesWarningsPassed(seriesInstanceUID) ? 'Valid' : 'Rejected'
        seriesToPush.selectedSeries = this.props.seriesReady.includes(seriesInstanceUID)

        seriesArray.push({
          ...seriesToPush
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
  IsSeriesWarningsPassed(series) {
    for (const warning in this.props.warningsSeries[series]) {
      if (!this.props.warningsSeries[series][warning].dismissed) {
        return false
      }
    }
    return true
  }

  render() {
    return (
      <div disabled={this.props.isUploading}>
        <Row>
          <DisplayStudies multiUpload={this.props.multiUpload} studiesRows={this.buildStudiesRows()} checkStudyReady={(studyID) => { this.studyWarningsPassed(studyID) }} />
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
