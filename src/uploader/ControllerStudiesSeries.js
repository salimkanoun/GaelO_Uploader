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
import DisplayStudies from './DisplayStudies.js'
import DisplaySeries from './DisplaySeries.js'
import Row from 'react-bootstrap/Row'


export default class ControllerStudiesSeries extends Component {

    state = {
        selectedStudy: undefined,
        seriestoUpload: [],
        selectedSeries: []
    }

    constructor(props) {
        super(props)
        this.updateSelectedSeries = this.updateSelectedSeries.bind(this)
    }

    prepareSeriesToUpload = () => {
        //console.log(this.state.selectedSeries)
        let seriesIDs = this.state.selectedSeries
        let series = []
            let study = this.props.uploadModel.getStudy(this.state.selectedStudy)['series']
            seriesIDs.forEach( (serie) => {
                    console.log(study[serie])
                    series.push(study[serie])
                
                 } )
    
        console.log(series)
        this.setState( { seriesToUpload: [...series] }, () => (console.log(this.state.seriesToUpload)) )
        
    }

    updateSelectedSeries = (series) => {
        console.log(series)
        this.setState( {selectedSeries: series }, () => (this.prepareSeriesToUpload()))
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
            <Fragment>
                <Row>
                    <DisplayStudies validateCheckPatient={this.validateCheckPatient} ignoreStudyWarning={this.ignoreStudyWarning}
                        studies={this.props.uploadModel.getStudiesArray()} onSelectChange={this.setCurrentStudy} />
                </Row>
                <Row>
                    <DisplaySeries studyUID={this.state.selectedStudy} series={this.getSeries(this.state.selectedStudy)}
                    selectedSeries={this.updateSelectedSeries} />
                </Row>
            </Fragment>
        )
    }
}