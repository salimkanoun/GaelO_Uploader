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
import DisplayStudies from './DisplayStudies.js'
import DisplaySeries from './DisplaySeries.js'
import Row from 'react-bootstrap/Row'


export default class ControllerStudiesSeries extends Component {

    state = {
        selectedStudy: undefined,
        seriestoUpload: [],
        studiesToUpload: {},
        selectedSeries: []
    }

    constructor(props) {
        super(props)
        this.updateSelectedSeries = this.updateSelectedSeries.bind(this)
        this.setCurrentStudy = this.setCurrentStudy.bind(this)
    }

    prepareSeriesToUpload = () => {
        let seriesIDs = this.state.selectedSeries
        let series = []
        let tempSeries = this.props.uploadModel.getStudy(this.state.selectedStudy)['series']
        let studyID = this.props.uploadModel.getStudy(this.state.selectedStudy)['studyUID']
        seriesIDs.forEach((serie) => {
            //Check series validation
            if (tempSeries[serie] !== undefined) series.push(tempSeries[serie])
        })
        this.setState((prevState) => ({
            seriesToUpload: {
                ...prevState.seriesToUpload,
                [studyID]: { ...series }
            }
        }), () => (this.prepareStudiesToUpload()))
    }

    prepareStudiesToUpload = () => {
        let studiesIDs = Object.values(this.state.selectedSeries)
        console.log(studiesIDs)
        let studiesReady = {}
        studiesIDs.forEach(study => {
            console.log(this)
            let studyInfo = this.props.uploadModel.getStudy(study)
            //Check if study's warnings have been bypassed      if (studyInfo)
            console.log(study)
            console.log(this.props.uploadModel.getStudy(study))
            //delete studyInfo['series']
            studiesReady[study] = studyInfo
        }
        )
        studiesIDs.forEach( (studyID) => {
        this.setState((prevState) => ({
            studiesToUpload: {
                ...prevState.studiesToUpload,
                [studyID]: { ...studiesReady[studyID] }
            }
        }), () => (console.log(this.state.studiesToUpload)))
    }
        )
    }

    getValidatedItems = () => {
        return 'ici'
        //Return validated series only
    }

    updateSelectedSeries = (series) => {
        this.setState({ selectedSeries: series }, () => (this.prepareSeriesToUpload()))
    }

    setCurrentStudy = (studyUID) => {
        this.setState({ selectedStudy: studyUID })
    }

    validateCheckPatient(studyUID) {
        //console.log(studyUID)
    }

    ignoreStudyWarning(studyUID) {

    }

    getSeries(studyUID) {
        if (studyUID !== undefined) {
            return this.props.uploadModel.getStudy(studyUID).getSeriesArray()
        }
        else return []
    }

    render() {
        return (
            <>
                <Row>
                    <DisplayStudies validateCheckPatient={this.validateCheckPatient} ignoreStudyWarning={this.ignoreStudyWarning}
                        studies={this.props.uploadModel.getStudiesArray()} onSelectChange={this.setCurrentStudy} />
                </Row>
                <Row>
                    <DisplaySeries studyUID={this.state.selectedStudy} series={this.getSeries(this.state.selectedStudy)}
                        selectedSeries={this.updateSelectedSeries} />
                </Row>
            </>
        )
    }
}