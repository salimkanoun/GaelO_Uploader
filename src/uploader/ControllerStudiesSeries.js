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

import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'

import Row from 'react-bootstrap/Row'

import DisplayStudies from './DisplayStudies.js'
import DisplaySeries from './DisplaySeries.js'
import { selectSeriesReady } from './actions/DisplayTables'

class ControllerStudiesSeries extends Component {

    /* STUDIES TABLE CONTROLLER */

    /**
     * Fetch studies from Redux State to display in table
     */
    buildStudiesRows() {
        let studies = []
        if (Object.keys(this.props.studies).length > 0) {
            for (let study in this.props.studies) {
                let tempStudy = this.props.studies[study]
                tempStudy['status'] = this.studyWarningsPassed(study)
                studies.push({ ...tempStudy })
            }
        }
        return studies
    }

    /**
     * Check the study status according to its warnings and its series' warnings 
     */
    studyWarningsPassed(study) {
        let studyStatus = 'Valid'
        //Check for warnings in study
        for (let warning in this.props.studies[study].warnings) {
            if (!this.props.studies[study].warnings[warning].dismissed) {
                studyStatus = 'Rejected'
                return studyStatus
            }
        }
        //Check for warnings in series
        for (let series in this.props.series) {
            if (Object.keys(this.props.studies[study].series).includes(series)) {
                for (let warning in this.props.warningsSeries[series]) {
                    if (!this.props.warningsSeries[series][warning].dismissed) {
                        studyStatus = 'Incomplete'
                    }
                }
            }
        }
        return studyStatus
    }

    /* SERIES TABLE CONTROLLER */

    /**
     * Add status and selection state to previous information from the selected study's series 
     * in order to build table
     */
    buildSeriesRows() {
        if (this.props.selectedStudy !== null && this.props.selectedStudy !== undefined) {
            let seriesArray = []
            let seriesToDisplay = Object.keys(this.props.studies[this.props.selectedStudy].series)
            seriesToDisplay.forEach((series) => {
                let seriesToPush = this.props.series[series]
                seriesToPush['status'] = this.seriesWarningsPassed(series) ? 'Valid' : 'Rejected'
                seriesToPush['selectedSeries'] = false
                if (this.props.seriesReady.includes(seriesToPush.seriesInstanceUID)) {
                    seriesToPush['selectedSeries'] = true
                }
                seriesArray.push({
                    ...seriesToPush
                })
            }
            )
            return seriesArray
        }
        else return []
    }

    /**
     * Check if the series warnings have been all passed
     */
    seriesWarningsPassed(series) {
        for (let warning in this.props.warningsSeries[series]) {
            if (!this.props.warningsSeries[series][warning].dismissed) {
                return false
            }
        }
        return true
    }

    render() {
        return (
            <Fragment>
                <Row>
                    <DisplayStudies multiUpload={this.props.multiUpload} studiesRows={this.buildStudiesRows()} />
                </Row>
                <Row>
                    <DisplaySeries seriesRows={this.buildSeriesRows()} />
                </Row>
            </Fragment>
        )
    }
}


const mapStateToProps = state => {
    return {
        series: state.Series.series,
        studies: state.Studies.studies,
        seriesReady: state.DisplayTables.seriesReady,
        selectedStudy: state.DisplayTables.selectedStudy,
        selectedSeries: state.DisplayTables.selectedSeries,
        warningsSeries: state.Warnings.warningsSeries,
    }
}

const mapDispatchToProps = {
    selectSeriesReady
}

export default connect(mapStateToProps, mapDispatchToProps)(ControllerStudiesSeries)