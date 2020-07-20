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

    componentDidUpdate(prevState) {
        if (prevState.seriesReady !== this.props.seriesReady) {
            this.prepareSeriesToUpload()
        }
    }

    /**
     * Prepare series ready to upload 
     * to send to master controller
     */
    prepareSeriesToUpload = () => {
        let seriesInstanceUIDs = this.props.seriesReady
        let series = {}
        //Fetch series in the model
        let studies = Object.values(this.props.studies)
        studies.forEach(study => {
            let studyInstanceUID = study.studyInstanceUID
            //Check if there is no warning on study level
            if (this.props.studies[studyInstanceUID].warnings = {}) {
                //If there isn't, series are OK to be uploaded
                Object.values(study.series).forEach(theSeries => {
                    if (seriesInstanceUIDs.includes(theSeries.seriesInstanceUID)) {
                        if (series[studyInstanceUID] === undefined) {
                            series[studyInstanceUID] = []
                        }
                        series[studyInstanceUID].push(theSeries.seriesInstanceUID)
                    }
                })
            }
        })
    }

    render() {
        return (
            <Fragment>
                <Row>
                    <DisplayStudies multiUploader={this.props.multiUploader} studies={this.props.studies} series={this.props.series} validateCheckPatient={this.validateCheckPatient} ignoreStudyWarning={this.ignoreStudyWarning} />
                </Row>
                <Row>
                    <DisplaySeries selectedStudy={this.props.selectedStudy} />
                </Row>
            </Fragment>
        )
    }
}


const mapStateToProps = state => {
    return {
        studies: state.Studies.studies,
        series: state.Series.series,
        selectedStudy: state.DisplayTables.selectedStudy,
        seriesReady: state.DisplayTables.seriesReady
    }
}

const mapDispatchToProps = {
    selectSeriesReady
}

export default connect(mapStateToProps, mapDispatchToProps)(ControllerStudiesSeries)