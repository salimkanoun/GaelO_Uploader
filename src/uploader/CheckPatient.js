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
import { validateCheckPatient, checkPatientData } from './actions/Warnings'


class CheckPatient extends Component {

    state = {
        rows: [],
        isDisabled: true
    }

    constructor(props) {
        super(props)
        this.onClick = this.onClick.bind(this)
        this.validateCheckPatient = this.validateCheckPatient.bind(this)
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
                <ButtonIgnore rowIndex={rowIndex} onClick={this.onClick}
                    warning={this.state.rows[rowIndex].ignoredStatus} /> : null)
        },
        {
            dataField: 'ignoredStatus',
            hidden: false
        },
    ]

    onClick(rowIndex) {
        let newRows = this.state.rows
        newRows[rowIndex].ignoredStatus = !newRows[rowIndex].ignoredStatus
        this.setState({ rows: newRows }, () => {
            let isDisabled = false
            for (let row in this.state.rows) {
                if (this.state.rows[row].ignoredStatus === false) isDisabled = true
            }
            this.setState({ isDisabled: isDisabled })
        })
    }

    validateCheckPatient = () => {
        this.props.validateCheckPatient(this.props.selectedStudy)
        this.props.closeListener()
    }

    componentDidUpdate(prevState) {
        if(prevState.checkPatientDataTable !== this.props.checkPatientDataTable) {
            this.buildRows()
        }
    }
    buildRows() {
        console.log("rows built")
        let rows = []
        this.props.checkPatientDataTable.forEach(row => {
            let rowStatus = this.setRowStatus(row.currentStudy, row.expectedStudy)
            rows.push({...row, ignoredStatus: rowStatus })
        })
        this.setState({rows: rows})
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
            <Modal show={this.props.show} onHide={this.props.closeListener} updatedData={this.props.studyInstanceUID}>
                <Modal.Header className="modal-header" closeButton>
                    <Modal.Title className="modal-title" id="du-patientLongTitle">{this.props.multiUploader ? 'Select Patient' : 'Check Patient'}</Modal.Title>
                </Modal.Header>
                <Modal.Body hidden={!this.props.multiUploader} className="modal-body du-patient" id='du-patp-comparison'>
                    <SelectPatient />
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
        checkPatientDataTable: state.Warnings.checkPatientDataTable,
    }
}

const mapDispatchToProps = {
    validateCheckPatient,
    checkPatientData
}

export default connect(mapStateToProps, mapDispatchToProps)(CheckPatient)