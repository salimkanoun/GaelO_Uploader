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
import { selectSeriesReady, selectStudiesReady } from './actions/DisplayTables'

class ControllerStudiesSeries extends Component {
  /* STUDIES TABLE CONTROLLER */

  /**
   * Fetch studies from Redux State to display in table
   * @return {Object}
   */
  buildStudiesRows () {
    const studies = []
    if (Object.keys(this.props.studies).length > 0) {
      for (const study in this.props.studies) {
        const tempStudy = this.props.studies[study]
        tempStudy.status = this.studyWarningsPassed(study)
        tempStudy.selectedStudies = false
        if (this.props.studiesReady.includes(tempStudy.studyInstanceUID)) {
          tempStudy.selectedStudies = true
        }
        studies.push({ ...tempStudy })
      }
    }
    return studies
  }

  /**
   * Check the study status according to its warnings and its series' warnings
   * @param {Object} study
   * @return {Boolean}
   */
  studyWarningsPassed (study) {
    let studyStatus = 'Valid'
    // Check for warnings in study
    for (const warning in this.props.studies[study].warnings) {
      if (!this.props.studies[study].warnings[warning].dismissed) {
        studyStatus = 'Rejected'
        if (!this.props.multiUpload) this.props.selectStudiesReady(study, false)
        return studyStatus
      }
    }
    // Check for warnings in series
    for (const series in this.props.series) {
      if (Object.keys(this.props.studies[study].series).includes(series)) {
        for (const warning in this.props.warningsSeries[series]) {
          if (!this.props.warningsSeries[series][warning].dismissed) {
            studyStatus = 'Incomplete'
          }
        }
      }
    }
    //If not in multiUpload, valid studies are ready to be uploaded
    if (!this.props.multiUpload) this.props.selectStudiesReady(study, (studyStatus === 'Valid' ? true : false))
    return studyStatus
  }

  /**
   * SINGLEUPLOAD mode function only
   * Update studies ready to be uploaded considering their current status
   * @param {*} prevProps 
   */
  componentDidUpdate(prevProps) {
    if(!this.props.multiUpload) {
      for (const study in this.props.studies) {
        if (study.status !== prevProps.status) this.props.selectStudiesReady(study.studyInstanceUID, (study.status === 'Valid' ? true : false))
      }
    }
  }

  /* SERIES TABLE CONTROLLER */

  /**
   * Add status and selection state to previous information from the selected study's series
   * in order to build table
   * @return {Array}
   */
  buildSeriesRows () {
    if (this.props.selectedStudy !== null && this.props.selectedStudy !== undefined) {
      const seriesArray = []
      const seriesToDisplay = Object.keys(this.props.studies[this.props.selectedStudy].series)
      seriesToDisplay.forEach((series) => {
        const seriesToPush = this.props.series[series]
        seriesToPush.status = this.seriesWarningsPassed(series) ? 'Valid' : 'Rejected'
        seriesToPush.selectedSeries = false
        if (this.props.seriesReady.includes(seriesToPush.seriesInstanceUID)) {
          seriesToPush.selectedSeries = true
        }
        seriesArray.push({
          ...seriesToPush
        })
      }
      )
      return seriesArray
    } else return []
  }

  /**
   * Check if the series warnings have been all passed
   * @param {Object} series
   * @return {Boolean}
   */
  seriesWarningsPassed (series) {
    for (const warning in this.props.warningsSeries[series]) {
      if (!this.props.warningsSeries[series][warning].dismissed) {
        return false
      }
    }
    return true
  }

  render () {
    return (
      <>
        <Row>
          <DisplayStudies multiUpload={this.props.multiUpload} studiesRows={this.buildStudiesRows()} />
        </Row>
        <Row>
          <DisplaySeries seriesRows={this.buildSeriesRows()} />
        </Row>
      </>
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
    warningsSeries: state.Warnings.warningsSeries
  }
}

const mapDispatchToProps = {
  selectSeriesReady,
  selectStudiesReady
}

export default connect(mapStateToProps, mapDispatchToProps)(ControllerStudiesSeries)
