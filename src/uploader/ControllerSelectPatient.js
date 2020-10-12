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

import { Modal, Button } from 'react-bootstrap'
import SelectPatient from './SelectPatient'
import CheckPatient from './render_component/CheckPatient'
import { updateWarningStudy, setVisitID } from './actions/Studies'
import { setUsedVisit } from './actions/Visits'
import { selectStudiesReady } from './actions/DisplayTables'

const labels = ['First Name', 'Last Name', 'Birth Date', 'Sex', 'Acquisition Date']
const keys = ['patientFirstName', 'patientLastName', 'patientBirthDate', 'patientSex', 'acquisitionDate']

class ControllerSelectPatient extends Component {

    state = {
        rows: [], //Table rows to display
        isDisabled: true, //Status of 'validate' button
        selectedVisit: undefined, //ID of selected visit when in multiUpload
    }

    constructor(props) {
        super(props)
        this.onClick = this.onClick.bind(this)
        this.validateCheckPatient = this.validateCheckPatient.bind(this)
        this.generateRows = this.generateRows.bind(this)
    }

    /**
     * Build table rows on study selection
     * @param {*} prevState 
     */
    componentDidUpdate(prevState) {
        if ((prevState.selectedStudy !== this.props.selectedStudy && this.props.selectedStudy !== undefined) || prevState.show !== this.props.show) {
            this.setState({ rows: this.buildRows() })
        }
    }

    /**
     * Change ignored state of thisRow
     * If all rows have been ignored, enable validation button
     * @param {Object} thisRow 
     */
    onClick = thisRow => {
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

    /**
     * Dismiss study warning to check patient on user validation
     */
    validateCheckPatient = () => {
        this.props.updateWarningStudy(this.props.studies[this.props.selectedStudy].warnings['NOT_EXPECTED_VISIT'], this.props.selectedStudy)
        this.props.updateWarningStudy(this.props.studies[this.props.selectedStudy].warnings['NULL_VISIT_ID'], this.props.selectedStudy)
        //If multiUpload mode on, set idVisit to the study and forbid its use for another study 
        if (this.props.multiUpload) {
            this.props.setVisitID(this.props.studies[this.props.selectedStudy].studyInstanceUID, this.state.selectedVisit)
            this.props.setUsedVisit(this.state.selectedVisit, this.props.selectedStudy, true)
        } else {
            if (this.props.checkStudyReady(this.props.studies[this.props.selectedStudy].studyInstanceUID) !== 'Rejected') this.props.selectStudiesReady(this.props.studies[this.props.selectedStudy].studyInstanceUID, true)
        }
        this.setState({ isDisabled: true })
        this.props.closeListener()
    }

    /**
     * Check matching of patient information
     * @return {Array}
     */
    buildRows(uploadDataReady = !this.props.multiUpload, idVisit = this.props.studies[this.props.selectedStudy].idVisit) {
        if (this.props.selectedStudy !== null && this.props.selectedStudy !== undefined && uploadDataReady) {
            let rows = []
            let currentStudy = this.props.studies[this.props.selectedStudy]

            //Extract only first letter of patient first and last names
            currentStudy.patientFirstName = currentStudy.patientFirstName.slice(0, 1)
            currentStudy.patientLastName = currentStudy.patientLastName.slice(0, 1)

            //Find expected visit
            let expectedStudy

            this.props.visits.forEach(visit => {
                console.log(visit.idVisit)
                if (visit.idVisit === idVisit) expectedStudy = visit
            })

            expectedStudy.patientFirstName = expectedStudy.patientFirstName === undefined ? '' : expectedStudy.patientFirstName.toUpperCase()
            expectedStudy.patientLastName = expectedStudy.patientLastName === undefined ? '' : expectedStudy.patientLastName.toUpperCase()

            for (let i in labels) {
                rows.push({
                    rowName: labels[i],
                    expectedStudy: expectedStudy[keys[i]],
                    currentStudy: currentStudy[keys[i]],
                    ignoredStatus: this.setRowStatus(expectedStudy[keys[i]], currentStudy[keys[i]])
                })
            }
            return rows
        } else {
            let rows = []
            for (let i in labels) {
                rows.push({
                    rowName: labels[i],
                    expectedStudy: '',
                    currentStudy: '',
                    ignoredStatus: ''
                })
            }
            return rows
        }
    }

    /**
     * MULTIUPLOAD mode fuction only
     * Updates the selected visit id from the child selection
     * And build table rows accordingly
     * @param {String} selectedVisit 
     */
    generateRows = (selectedVisit) => {
        this.setState({ selectedVisit: selectedVisit })
        this.setState(() => ({ rows: this.buildRows(true, selectedVisit) }))
    }

    /**
     * Check correspondance between expected and given data and set rowStatus accordingly
     * @return {Boolean}
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
                    <Modal.Title className="modal-title">
                        {this.props.multiUpload ? 'Select Patient' : 'Check Patient'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="modal-body du-patient">
                    <SelectPatient hidden={!this.props.multiUpload} studyInstanceUID={this.props.selectedStudy} generateRows={this.generateRows} />
                    <CheckPatient onClick={this.onClick} rows={this.state.rows} multiUpload={this.props.multiUpload} />
                </Modal.Body>
                <Modal.Footer className="modal-footer">
                    <Button type="button" onClick={this.validateCheckPatient} className="btn btn-primary" data-dismiss="modal" disabled={this.state.isDisabled}>
                        This is the correct patient
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

const mapStateToProps = state => {
    return {
        selectedStudy: state.DisplayTables.selectedStudy,
        studies: state.Studies.studies,
        visits: state.Visits.visits,
    }
}

const mapDispatchToProps = {
    updateWarningStudy,
    setUsedVisit,
    setVisitID,
    selectStudiesReady
}

export default connect(mapStateToProps, mapDispatchToProps)(ControllerSelectPatient)