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

import { setExpectedVisitID } from './actions/Studies'

class SelectPatient extends Component {

    state = {
        selectedType: undefined,
        selectedVisit: undefined
    }

    constructor(props) {
        super(props)
        this.selectType = this.selectType.bind(this)
    }

    fetchVisitTypes() {
        let visitTypeArray = []
        this.props.visits.forEach(visit => {
            let thisVisitType = visit.visitType
            if (!visitTypeArray.includes(thisVisitType)) visitTypeArray.push({ value: thisVisitType, label: thisVisitType })
        })
        return visitTypeArray
    }

    displayPatients() {
        let finalDisplay = []
        this.props.visits.forEach((visit) => {
            if (this.state.selectedType !== undefined && visit.visitType === this.state.selectedType.value) {
                finalDisplay.push(<ListGroup.Item key={visit.idVisit} action onClick={(id) => this.selectPatient(visit.idVisit)} disabled={visit.isUsed}>{visit.numeroPatient}</ListGroup.Item>)
            }
        })

        return finalDisplay
    }

    selectPatient = selectedVisit => {
        this.setState({ selectedVisit }, this.props.generateRows(selectedVisit))
        this.props.setExpectedVisitID(this.props.studyInstanceUID, selectedVisit)
    }

    selectType = selectedType => {
        this.setState({ selectedType });
    }

    render() {
        return (
            <>
                <span className='du-patp-label'>Select Visit Type</span>
                <Select options={this.fetchVisitTypes()} onChange={this.selectType} />
                <span className='du-patp-label'>Select Patient</span>
                <ListGroup variant='flush'>
                    {this.displayPatients(this.state.selectedType)}
                </ListGroup>
                <span className='du-patp-label'>Comparison</span>
                <p>We let you check if the selected patient and the imported patient informations are matching:</p>
            </>
        )
    }
}

const mapStateToProps = state => {
    return {
        visits: state.Visits.visits
    }
}
const mapDispatchToProps = {
    setExpectedVisitID
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectPatient)