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

class SelectPatient extends Component {

    constructor(props) {
        super(props)
        this.displayPatients = this.displayPatients.bind(this)
    }

    fetchVisitTypes() {
        let visitType
        this.displayPatients(visitType)
    }

    displayPatients = (visitType) => {
        let rows = 
        this.props.visits.forEach((index) => {
            
        })
    }

    render() {
        return (
            <>
                <span className='du-patp-label'>Select Visit Type</span>
                <Select options={this.fetchVisitTypes()}>

                </Select>
                <span className='du-patp-label'>Select Patient</span>
                <ListGroup options={this.displayPatients}>

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
    
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectPatient)