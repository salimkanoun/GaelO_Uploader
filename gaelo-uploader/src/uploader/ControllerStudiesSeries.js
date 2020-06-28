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


export default class ControllerStudiesSeries extends Component {

    state = {
        selectedStudy: undefined
    }

    constructor(props) {
        super(props)
        //this.handleToUpdate = this.handleToUpdate.bind(this)
    }

    setCurrentStudy = (studyUID) => {
        this.setState({ selectedStudy : studyUID })

    }

    validateCheckPatient(studyUID){
        console.log(studyUID)
    }

    ignoreStudyWarning(studyUID){

    }

    getSeries(studyUID){
        console.log('change Series')
        console.log(studyUID)
        
        if(studyUID !== undefined) {
            console.log(this.props.uploadModel.getStudy(studyUID).getSeriesArray())
            return this.props.uploadModel.getStudy(studyUID).getSeriesArray()
        }
        else return []
    }

    render() {
        return (
            <Fragment>
                <DisplayStudies validateCheckPatient = {this.validateCheckPatient} ignoreStudyWarning = {this.ignoreStudyWarning} studies={this.props.uploadModel.getStudiesArray()} onSelectChange={this.setCurrentStudy} />
                <DisplaySeries studyUID={this.state.selectedStudy} series = {this.getSeries(this.state.selectedStudy)} />
            </Fragment>
        )
    }
}