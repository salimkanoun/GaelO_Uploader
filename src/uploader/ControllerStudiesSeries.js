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

class ControllerStudiesSeries extends Component {

    state = {
        update: false,
        seriesToUpload: {},
        selectedSeries: []
    }

    prepareSeriesToUpload = () => {
        let seriesIDs = this.state.selectedSeries
        let series = {}
        //Fetch series in the model
        let studies = this.props.uploadModel.getStudiesArray()
        studies.forEach(study => {
            //Check study validation
            // ...
            let studyID = study.studyUID
            Object.keys(study.series).forEach(seriesID => {
                if (seriesIDs.includes(seriesID)) {
                    if (series[studyID] === undefined) {
                        series[studyID] = {}
                    }
                    series[studyID][seriesID] = study.series[seriesID]
                }
            })
        })
        console.log(series)
        this.setState(
            { seriesToUpload: series }
            , () => console.log(this.state.seriesToUpload))
    }

    render() {
        return (
            <Fragment>
                <Row>
                    <DisplayStudies ignoreStudyWarning={this.ignoreStudyWarning}/>
                </Row>
                <Row>
                    <DisplaySeries selectedStudy = {this.props.selectedStudy} />
                </Row>
            </Fragment>
        )
    }
}


const mapStateToProps = state => {
    return {
        studies: state.Studies,
        series: state.Series,
        selectedStudy: state.DisplayTables.selectedStudy
    }
}

const mapDispatchToProps = {
    
}

export default connect(mapStateToProps, mapDispatchToProps)(ControllerStudiesSeries)