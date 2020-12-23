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
import { updateWarningStudy, setVisitID } from '../actions/Studies'
import { setUsedVisit } from '../actions/Visits'
import { selectStudiesReady } from '../actions/DisplayTables'
import Util from '../model/Util'

class ControllerSelectPatient extends Component {

    state = {
        rows: [], //Table rows to display
        isDisabled: true, //Status of 'validate' button
        selectedVisit: undefined, //ID of selected visit when in multiUpload
    }
    
    /**
     * Build table rows on study selection
     * @param {*} prevState 
     */
    componentDidUpdate = (prevState) => {
        if ((prevState.selectedStudy !== this.props.selectedStudy && this.props.selectedStudy !== undefined) || prevState.show !== this.props.show) {
            this.setState({ rows: this.buildRows() })
        }
    }

    /**
     * Change ignored state of thisRow
     * If all rows have been ignored, enable validation button
     * @param {Object} thisRow 
     */
    onClick = (thisRow) => {
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
        if (this.props.studies[this.props.selectedStudy].warnings['NOT_EXPECTED_VISIT'] !== undefined) this.props.updateWarningStudy(this.props.studies[this.props.selectedStudy].warnings['NOT_EXPECTED_VISIT'], this.props.selectedStudy)
        if (this.props.studies[this.props.selectedStudy].warnings['NULL_VISIT_ID'] !== undefined) this.props.updateWarningStudy(this.props.studies[this.props.selectedStudy].warnings['NULL_VISIT_ID'], this.props.selectedStudy)
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
    buildRows = (uploadDataReady = !this.props.multiUpload, idVisit = this.props.studies[this.props.selectedStudy].idVisit) => {
        
        
        /**
         * Check correspondance between expected and given data and set rowStatus accordingly
         * @return {Boolean}
         */
        function isCheckPass(expected, current) {
            if ( expected === '' || expected === current ) {
                return null
            } else {
                return false
            }
        }
        
        if (this.props.selectedStudy !== null && this.props.selectedStudy !== undefined && uploadDataReady) {
            let rows = []


            let currentStudy = this.props.studies[this.props.selectedStudy]

            //Retrive Data from DICOM Model
            let dicomLastName  = currentStudy.patientLastName.toUpperCase().slice(0, 1)
            let dicomFirstName  = currentStudy.patientFirstName.toUpperCase().slice(0, 1)
            let dicomDateOfBirth = Util.formatRawDate(currentStudy.patientBirthDate)
            let dicomAcquisitionDate = Util.formatRawDate(currentStudy.acquisitionDate)
            let dicomPatientSex = currentStudy.patientSex
            
            //Find expected visit
            let expectedStudy = this.props.visits.filter(visit => {
                return (visit.idVisit === idVisit)
            })

            if(expectedStudy.length !== 1) {
                throw new Error('Error finding study')
            }else{
                expectedStudy  = expectedStudy[0]
            }

            //Format visit data for table
            // double == (not ===) check if undefined or null
            expectedStudy.patientFirstName = expectedStudy.firstName == null ? '' : expectedStudy.firstName.toUpperCase().slice(0, 1)
            expectedStudy.patientLastName = expectedStudy.lastName == null ? '' : expectedStudy.lastName.toUpperCase().slice(0, 1)
            expectedStudy.patientBirthDate = expectedStudy.patientDOB

            rows.push({
                rowName: 'First Name',
                expectedStudy: expectedStudy.patientFirstName,
                currentStudy: dicomFirstName,
                ignoredStatus: isCheckPass(expectedStudy.patientFirstName, dicomFirstName)
            })

            rows.push({
                rowName: 'Last Name',
                expectedStudy: expectedStudy.patientLastName,
                currentStudy: dicomLastName,
                ignoredStatus: isCheckPass(expectedStudy.dicomLastName, dicomLastName)
            })

            rows.push({
                rowName: 'Birth Date',
                expectedStudy: expectedStudy.patientBirthDate,
                currentStudy: dicomDateOfBirth,
                ignoredStatus: isCheckPass(expectedStudy.patientBirthDate, dicomDateOfBirth)
            })

            rows.push({
                rowName: 'Sex',
                expectedStudy: expectedStudy.patientSex,
                currentStudy: dicomPatientSex,
                ignoredStatus: isCheckPass(expectedStudy.patientSex, dicomPatientSex)
            })

            rows.push({
                rowName: 'Acquisition Date',
                expectedStudy: expectedStudy.acquisitionDate,
                currentStudy: dicomAcquisitionDate,
                ignoredStatus: isCheckPass(expectedStudy.acquisitionDate, dicomAcquisitionDate)
            })

            return rows

        } else {
            
            let rows = []

            const labels = ['First Name', 'Last Name', 'Birth Date', 'Sex', 'Acquisition Date']

            labels.forEach( (label) =>{
                rows.push({
                    rowName: label,
                    expectedStudy: '',
                    currentStudy: '',
                    ignoredStatus: ''
                })
            })

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
        this.setState(() => ({ rows: this.buildRows(true, selectedVisit) }), () => {
            let disableValidateButton = false
            for (let row in this.state.rows) {
                if (this.state.rows[row].dismissed !== undefined && !this.state.rows[row].dismissed) disableValidateButton = true
            }
            this.setState({ isDisabled: disableValidateButton })
        })
    }

    render = () => {
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