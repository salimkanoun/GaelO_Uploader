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
import ListGroup from 'react-bootstrap/ListGroup'
import Select from 'react-select'
import Util from '../model/Util'
import ControllerCheckPatient from './ControllerCheckPatient'

class SelectPatient2 extends Component {

    state = {
        selectedVisitType: undefined,
        selectedVisit : undefined
    }

    /**
     * Fetch available visit types from Redux
     * @return {Array}
     */
    getVisitTypesOptions = () => {
        let visitTypeArray = []
        for(let visitObject of Object.values(this.props.visits)){
            let visitType = visitObject.visitType
            if (!Util.arrayIncludesObject(visitTypeArray, 'value', visitType)) {
                visitTypeArray.push({ value: visitType, label: visitType })
            }
        }

        //if(visitTypeArray.length === 1) this.selectType(visitTypeArray[0])

        return visitTypeArray
    }

    /**
     * Fetch patient list of selected visit type from Redux
     * and create item for each
     * @return {Array}
     */
    displayPatients = () => {

        if(this.state.selectedVisitType == null) return []

        let finalDisplay = []

        for( let visitObject of Object.values(this.props.visits) ) {

            if ( visitObject.visitType === this.state.selectedVisitType.value ) {
                finalDisplay.push(
                    <ListGroup.Item 
                        key={visitObject.idVisit} 
                        action 
                        onClick={() => this.selectVisit(visitObject.idVisit)} 
                        disabled={visitObject.studyID !== undefined}>
                            {visitObject.numeroPatient}
                    </ListGroup.Item>
                )
            }
        }
        return finalDisplay
    }

    /**
     * Update selectedVisitType state of visit
     * @param {String} selectedVisitType 
     */
    selectType = (selectedVisitType) => {
        this.setState({ selectedVisitType : selectedVisitType });
    }

    selectVisit = (idVisit) =>{
        this.setState(
            {selectedVisit : this.props.visits[idVisit]}
        )
    }

    render = () => {
        return (
            <>
                <div hidden={false}>
                    <span className='du-patp-label'>Select Visit Type</span>
                    <Select options={this.getVisitTypesOptions()} onChange={this.selectType} />
                    <span className='du-patp-label'>Select Patient</span>
                    <ListGroup variant='flush'>
                        {this.displayPatients()}
                    </ListGroup>
                </div>
                <ControllerCheckPatient currentStudy ={this.props.studies[this.props.selectedStudy]} expectedVisit={this.state.selectedVisit} onValidatePatient={this.props.onValidatePatient} />
            </>
        )
    }
}

const mapStateToProps = state => {
    return {
        visits: state.Visits.visits,
        selectedStudy : state.DisplayTables.selectedStudy,
        studies: state.Studies.studies
    }
}

export default connect(mapStateToProps, null)(SelectPatient2)