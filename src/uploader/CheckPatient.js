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

import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import BootstrapTable from 'react-bootstrap-table-next';
import SelectPatient from './SelectPatient'
import ButtonIgnore from './render_component/ButtonIgnore'
import { updateWarningStudy } from './actions/StudiesSeries'
import { setUsedVisit } from './actions/Visits'
import { NOT_EXPECTED_VISIT } from '../model/Warning';

const labels = ['First Name', 'Last Name', 'Birth Date', 'Sex', 'Acquisition Date']
const keys = ['patientFirstName', 'patientLastName', 'patientBirthDate', 'patientSex', 'acquisitionDate']

class CheckPatient extends Component {

    state = {
        rows: [],
        isDisabled: true
    }

    constructor(props) {
        super(props)
        this.onClick = this.onClick.bind(this)
        this.validateCheckPatient = this.validateCheckPatient.bind(this)
        this.generateRows = this.generateRows.bind(this)
    }

    columns = [
        {
            dataField: 'rowName',
            text: '',
        },
        {
            dataField: 'expectedStudy',
            text: 'Expected',
        },
        {
            dataField: 'currentStudy',
            text: 'Current',
        },
        {
            dataField: 'ignoreButton',
            text: '',
            formatter: (cell, row, rowIndex, extraData) => ((row.ignoredStatus !== null) ?
                <ButtonIgnore row={row} onClick={this.onClick}
                    warning={row.ignoredStatus} /> : null)
        },
        {
            dataField: 'ignoredStatus',
            text: '',
            hidden: true
        },
    ]

    onClick(thisRow) {
        let newRows = this.state.rows.map((row) => {
            let row2 = { ...row }
            if (row2.rowName === thisRow.rowName) row2.ignoredStatus = !row.ignoredStatus
            return row2
        })
        this.setState(() => ({ rows: newRows }), () => {
            let isDisabled = false
            for (let row in this.state.rows) {
                if (this.state.rows[row].ignoredStatus === false) isDisabled = true
            }
            this.setState(() => ({ isDisabled: isDisabled }))
        })
    }

    validateCheckPatient = () => {
        this.props.updateWarningStudy(this.props.studies[this.props.selectedStudy].warnings['NOT_EXPECTED_VISIT'], this.props.selectedStudy)
        //For multiupload 
        if (this.props.multiUpload) this.props.setUsedVisit(this.props.expectedVisitID, this.props.selectedStudy, true)
        this.props.closeListener()
    }

    componentDidUpdate(prevState) {
        if (prevState.selectedStudy !== this.props.selectedStudy || prevState.show !== this.props.show) {
            this.setState({rows: this.buildRows()})
        }
    }

    /**
     * Check matching of patient information
     */
    buildRows(idVisit = this.props.expectedVisitID, uploadDataReady = !this.props.multiUpload) {
        if (this.props.selectedStudy !== null && this.props.selectedStudy !== undefined && uploadDataReady) {
            let rows = []
            let currentStudy = this.props.studies[this.props.selectedStudy]
            //SK ICI patientName peut etre undefined (donc crash ici)
            //Peut etre plutot a gerer quand on construit l'entree study mettre les
            //caractères recherchés pour le match
            currentStudy.patientFirstName = currentStudy.patientFirstName.slice(0, 1)
            currentStudy.patientLastName = currentStudy.patientLastName.slice(0, 1)
            
            //Find expected visit
            let expectedStudy
            this.props.visits.forEach(visit => {
                if(visit.idVisit === idVisit) expectedStudy = visit
            })
            expectedStudy.patientFirstName = expectedStudy.firstName
            expectedStudy.patientLastName = expectedStudy.lastName

            for (let i in labels) {
                rows.push({
                    rowName: labels[i],
                    expectedStudy: expectedStudy[keys[i]],
                    currentStudy: currentStudy[keys[i]],
                    ignoredStatus: this.setRowStatus(expectedStudy[keys[i]], currentStudy[keys[i]])
                })
            }
            return rows
        } else return []
    }

    generateRows = (expectedVisitID) => {
        this.setState(() => ({rows: this.buildRows(expectedVisitID, true)}))
        
    }

    /**
     * Check correspondance between expected and given data and set rowStatus accordingly
     */
    setRowStatus(expected, current) {
        if (expected === undefined || expected === '' || expected === current) {
            return null
        } else {
            return false
        }
    }

    render() {
        return (
            <Modal show={this.props.show} onHide={this.props.closeListener}>
                <Modal.Header className="modal-header" closeButton>
                    <Modal.Title className="modal-title" id="du-patientLongTitle">{this.props.multiUpload ? 'Select Patient' : 'Check Patient'}</Modal.Title>
                </Modal.Header>
                <Modal.Body hidden={!this.props.multiUpload} className="modal-body du-patient" id='du-patp-comparison'>
                    <SelectPatient generateRows={this.generateRows}/>
                </Modal.Body>
                <Modal.Body className="modal-body" id="du-patp-comparison">
                    <p>The imported patient informations do not match with the ones in the server. We let you check these informations below:</p>
                    <BootstrapTable
                        keyField='rowName'
                        classes="table table-borderless"
                        bodyClasses="du-studies-tbody"
                        headerClasses="du-studies th"
                        rowClasses={rowClasses}
                        data={this.state.rows}
                        columns={this.columns}
                        selectRow={this.selectRow}
                    />
                    <p>If you want to force the upload you may have to ignore all the warnings.</p>
                </Modal.Body>
                <Modal.Footer className="modal-footer">
                    <Button id="du-patp-btn-confirm" type="button" onClick={this.validateCheckPatient} className="btn btn-primary" data-dismiss="modal" disabled={this.state.isDisabled}>This is the correct patient</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

const rowClasses = (row, rowIndex) => {
    if (row.ignoredStatus === false) {
        return 'du-studies row-danger'
    } else if (row.ignoredStatus === null) {
        return 'du-studies row-success'
    }
    return 'du-studies td'
}

const mapStateToProps = state => {
    return {
        selectedStudy: state.DisplayTables.selectedStudy,
        studies: state.Studies.studies,
        visits: state.Visits.visits,
        expectedVisitID: state.Visits.expectedVisitID
    }
}

const mapDispatchToProps = {
    updateWarningStudy,
    setUsedVisit
}

export default connect(mapStateToProps, mapDispatchToProps)(CheckPatient)