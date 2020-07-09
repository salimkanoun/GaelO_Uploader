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
import DisplayStudies from './render_component/DisplayStudies.js'
import DisplaySeries from './DisplaySeries.js'
import Row from 'react-bootstrap/Row'
//Redux
import { connect } from 'react-redux';

class ControllerStudiesSeries extends Component {

    state = {
        update: false,
        seriesToUpload: {},
        selectedSeries: []
    }

    constructor(props) {
        super(props)
        this.updateSelectedSeries = this.updateSelectedSeries.bind(this)
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

    getValidatedItems = () => {
        return 'ici'
        //Return validated series only
    }

    updateSelectedSeries = (series) => {
        this.setState({ selectedSeries: series }, () => (this.prepareSeriesToUpload()))
    }

    setCurrentStudy() {
    }

    validateCheckPatient(studyUID) {
        //console.log(studyUID)
    }

    ignoreStudyWarning(studyUID) {

    }

    getSeriesToDisplay() {
        if (this.props.selectedStudy !== undefined && this.props.selectedStudy !== null) {
            let seriesArray = []
            for (let seriesID in this.props.studies.series) {
                seriesArray.push(this.props.series[seriesID])
            }            
            return seriesArray
        }
        else return []
    }

    render() {
        return (
            <>
                <Row>
                    <DisplayStudies validateCheckPatient={this.validateCheckPatient} ignoreStudyWarning={this.ignoreStudyWarning}
                        onSelectChange={this.setCurrentStudy}/>
                </Row>
                <Row>
                    <DisplaySeries seriesFromParent={this.getSeriesToDisplay()} selectedSeries={this.updateSelectedSeries} />
                </Row>
            </>
        )
    }
}

/*

*/
const mapStateToProps = state => {
    return {
        studies: state.Model.studies,
        series: state.Model.series,
        selectedStudy: state.DisplayTables.selectedStudy
    }
}
const mapDispatchToProps = {
    
}

export default connect(mapStateToProps, mapDispatchToProps)(ControllerStudiesSeries)