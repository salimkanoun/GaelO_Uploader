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
  getStudyStatus(study) {

    if ( this.props.warningsStudies[study] === undefined ) {

      for (let seriesInstanceUID of this.props.studies[study].series) {
        if (!this.IsSeriesWarningsPassed(seriesInstanceUID)) {
          return 'Incomplete'
        }
      }

      return 'Valid'

    } else {

      if (this.props.warningsStudies[study]['ALREADY_KNOWN_STUDY'] !== undefined) {
        return 'Already Known'
      }

      if (this.props.warningsStudies[study]['NULL_VISIT_ID'] !== undefined) {
        return 'Rejected'
      }

    }

  }

  /**
   * Fetch studies from Redux State to display in Series table
   * @return {Object}
   */
  buildSeriesRows() {
    let seriesArray = []

    if (this.props.selectedStudy !== null) {

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
