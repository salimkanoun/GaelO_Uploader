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
import { addStudyReady } from '../actions/DisplayTables'
import Util from '../model/Util'

class ControllerCheckPatient extends Component {

    state = {
        rows: [], //Table rows to display
        isDisabled: true, //Status of 'validate' button
        selectedVisit: undefined, //ID of selected visit
    }
    
    /**
     * Build table rows on study selection
     * @param {*} prevState 
     */
    componentDidMount = () => {

        let rows = this.buildRows()
        let stillMissing = this.isStillAwaitingItems(rows)

        this.setState({ 
            rows: this.buildRows(),
            isDisabled : stillMissing
        })
    }

    /**
     * Change ignored state of thisRow
     * If all rows have been ignored, enable validation button
     * @param {Object} thisRow 
     */
    onClick = (thisRow) => {

        //Change updated item
        let newRows = this.state.rows.map((row) => {
            let row2 = { ...row }
            if (row2.rowName === thisRow.rowName) row2.ignoredStatus = !row.ignoredStatus
            return row2
        })

        //Determine if it still has item difference awaiting to be ignored
        let isDisabled = this.isStillAwaitingItems(newRows)

        //Update state with new status
        this.setState( () => ({ 
            rows: newRows,
            isDisabled: isDisabled 
        }) )
    }

    isStillAwaitingItems = (rows) => {
        rows.forEach( row  => {
            if  ( !row.ignoredStatus ) return true
        })
        return false
    }

    /**
     * Dismiss study warning to check patient on user validation
     */
    validateCheckPatient = () => {

       //SK ICI SUREMENT A FAIRE DANS SELECT PATIENT

        //Update redux to remove the Not Expected Visit
        if (this.props.studies[this.props.selectedStudy].warnings['NOT_EXPECTED_VISIT'] !== undefined) this.props.updateWarningStudy(this.props.studies[this.props.selectedStudy].warnings['NOT_EXPECTED_VISIT'], this.props.selectedStudy)
        //If multiUpload mode on, set idVisit to the study and forbid its use for another study 
        if (this.props.multiUpload) {
            //Assigned the VisitID
            this.props.setVisitID(this.props.studies[this.props.selectedStudy].studyInstanceUID, this.state.selectedVisit)
            //Remove the Null Warning (SK BOF BOF DEVRAIT ETRE GERER AUTOMATIQUEMENT QUAND ON SET LE VISIT ID)
            this.props.updateWarningStudy(this.props.studies[this.props.selectedStudy].warnings['NULL_VISIT_ID'], this.props.selectedStudy)
            this.props.setUsedVisit(this.state.selectedVisit, this.props.selectedStudy)
        }

        //If ready mark this study ready
        if (this.props.checkStudyReady(this.props.studies[this.props.selectedStudy].studyInstanceUID) !== 'Rejected') {
            this.props.addStudyReady(this.props.studies[this.props.selectedStudy].studyInstanceUID)
        }
        
        this.props.closeListener()
    }

    /**
     * Check matching of patient information
     * @return {Array}
     */
    buildRows = () => {

        let rows = []

        //SK CES PROPS DOIVENT VENIR DE SELECT PATIENT
        let currentStudy = this.props.currentStudy
        let expectedVisit = this.props.expectedVisit

        //Retrive Data from DICOM Model
        let dicomLastName  = currentStudy.patientLastName.toUpperCase().slice(0, 1)
        let dicomFirstName  = currentStudy.patientFirstName.toUpperCase().slice(0, 1)
        let dicomDateOfBirth = Util.formatRawDate(currentStudy.patientBirthDate)
        let dicomAcquisitionDate = Util.formatRawDate(currentStudy.acquisitionDate)
        let dicomPatientSex = currentStudy.patientSex

        //Format visit data for table
        // double == (not ===) check if undefined or null
        let patientFirstName = expectedVisit.firstName == null ? '' : expectedVisit.firstName.toUpperCase().slice(0, 1)
        let patientLastName = expectedVisit.lastName == null ? '' : expectedVisit.lastName.toUpperCase().slice(0, 1)
        let patientBirthDate = expectedVisit.patientDOB
        let patientSex = expectedVisit.patientSex
        let acquisitionDate = expectedVisit.acquisitionDate

        rows.push({
            rowName: 'First Name',
            expectedStudy: patientFirstName,
            currentStudy: dicomFirstName,
            ignoredStatus: this.isCheckPass(patientFirstName, dicomFirstName)
        })

        rows.push({
            rowName: 'Last Name',
            expectedStudy: patientLastName,
            currentStudy: dicomLastName,
            ignoredStatus: this.isCheckPass(patientLastName, dicomLastName)
        })

        rows.push({
            rowName: 'Birth Date',
            expectedStudy: patientBirthDate,
            currentStudy: dicomDateOfBirth,
            ignoredStatus: this.isCheckPass(patientBirthDate, dicomDateOfBirth)
        })

        rows.push({
            rowName: 'Sex',
            expectedStudy: patientSex,
            currentStudy: dicomPatientSex,
            ignoredStatus: this.isCheckPass(patientSex, dicomPatientSex)
        })

        rows.push({
            rowName: 'Acquisition Date',
            expectedStudy: acquisitionDate,
            currentStudy: dicomAcquisitionDate,
            ignoredStatus: this.isCheckPass(acquisitionDate, dicomAcquisitionDate)
        })

        return rows

    }

    /**
     * Check correspondance between expected and given data and set rowStatus accordingly
     * @return {Boolean}
     */
    isCheckPass = (expected, current) => {
        if ( expected === '' || expected === current ) {
            return null
        } else {
            return false
        }
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
    addStudyReady
}

export default connect(mapStateToProps, mapDispatchToProps)(ControllerSelectPatient)