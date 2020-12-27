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
import BootstrapTable from 'react-bootstrap-table-next';
import { Button, Container, Row, Col, Modal } from 'react-bootstrap'
import DisplayWarning from './DisplayWarning'
import SelectPatient from './SelectPatient'
import Util from '../model/Util'
import { connect } from 'react-redux';
import { selectStudy, addStudyReady, removeStudyReady } from '../actions/DisplayTables'

class StudiesTab extends Component {

    state = {
        showSelectPatient: false,
    }

    columns = [
        {
            dataField: 'selectedStudies',
            text: '',
            hidden: (!this.props.multiUpload),
            formatExtraData: this,
            formatter: (cell, row, rowIndex, formatExtraData) => {
                return (
                    <input disabled={row.status !== 'Valid'} 
                            type='checkbox' 
                            checked={this.props.studiesReady.includes(row.studyInstanceUID)} 
                            onChange={(event) => { 
                                if(event.target.checked) formatExtraData.props.addStudyReady(row.studyInstanceUID) 
                                else formatExtraData.props.removeStudyReady(row.studyInstanceUID) 
                            }} />
                )
            }
        },
        {
            dataField: 'studyInstanceUID',
            text: '',
            hidden: false,
            formatter: (cell, row, rowIndex, extraData) => {
                if ( !Util.isEmptyObject(this.props.studiesRows[rowIndex].warnings) ) {
                    if (this.props.studiesRows[rowIndex].warnings['ALREADY_KNOWN_STUDY'] !== undefined)
                        return (<></>)
                    else if ( this.props.studiesRows[rowIndex].warnings['NULL_VISIT_ID'] !== undefined && !this.props.studiesRows[rowIndex].warnings['NULL_VISIT_ID'].dismissed ) {
                        return (
                            <Button onClick={this.toggleSelectPatient}>
                                {(this.props.multiUpload) ? 'Select Patient' : 'Check Patient'}
                            </Button>
                        )
                    }
                    else if ( this.props.studiesRows[rowIndex].warnings['NULL_VISIT_ID'] !== undefined && this.props.studiesRows[rowIndex].warnings['NULL_VISIT_ID'].dismissed ) {
                        return (
                            <Button onClick={this.unvalidateCheckPatient}>
                                Reset Patient
                            </Button>
                        )
                    }
                }else{
                    return (<></>)
                }
                
            }
        },
        {
            dataField: 'status',
            text: 'Status',
        },
        {
            dataField: 'patientName',
            text: 'Patient name',
            style: { whiteSpace: 'normal', wordWrap: 'break-word' }
        },
        {
            dataField: 'studyDescription',
            text: 'Description',
            style: { whiteSpace: 'normal', wordWrap: 'break-word' }
        },
        {
            dataField: 'accessionNumber',
            text: 'Accession #',
            style: { whiteSpace: 'normal', wordWrap: 'break-word' }
        },
        {
            dataField: 'acquisitionDate',
            text: 'Date',
        },
    ]

    selectRow = {
        mode: 'radio',
        clickToSelect: true,
        hideSelectColumn: true,
        onSelect: (row) => {
            this.props.selectStudy(row.studyInstanceUID)
        }
    };
    
    /**
     * Toggle modal 'CheckPatient' of given row 
     */
    toggleSelectPatient = () => {
        this.setState( (state) => { return { showSelectPatient: !state.showSelectPatient } } )
    }

    rowClasses = (row, rowIndex) => {
        let className = ['du-studies']
        
        if (row.status === 'Rejected') className.push('row-danger')
        else if (row.status === 'Incomplete' || row.status === 'Already Known') className.push('row-warning')
        else if (row.status === 'Valid' && row.selectedStudies === true) className.push('row-success')
        else className.push('td')
        
        if (row.studyInstanceUID === this.props.selectedStudy) className.push('row-clicked')

        return className.join(' ')
    }

    validateCheckPatient = () => {
       
        //Update redux to remove the Not Expected Visit
        if (this.props.studies[this.props.selectedStudy].warnings['NOT_EXPECTED_VISIT'] !== undefined) this.props.updateWarningStudy(this.props.studies[this.props.selectedStudy].warnings['NOT_EXPECTED_VISIT'], this.props.selectedStudy)
        //If multiUpload mode on, set idVisit to the study and forbid its use for another study 
        if (this.props.multiUpload) {
           //Remove the Null Warning (SK BOF BOF DEVRAIT ETRE GERER AUTOMATIQUEMENT QUAND ON SET LE VISIT ID)
            this.props.updateWarningStudy(this.props.studies[this.props.selectedStudy].warnings['NULL_VISIT_ID'], this.props.selectedStudy)
        }

         //Assigned the VisitID
         this.props.setVisitID(this.props.studies[this.props.selectedStudy].studyInstanceUID, this.state.selectedVisit)
         this.props.setUsedVisit(this.state.selectedVisit, this.props.selectedStudy)

        //If ready mark this study ready
        if (this.props.checkStudyReady(this.props.studies[this.props.selectedStudy].studyInstanceUID) !== 'Rejected') {
            this.props.addStudyReady(this.props.studies[this.props.selectedStudy].studyInstanceUID)
        }
        
    }

    unvalidateCheckPatient(){
        console.log('unvalidate')

    }

    render() {
        return (
            <Container fluid>
                <span className='title'>Studies</span>

                <Modal show={this.state.showSelectPatient} onHide={this.toggleSelectPatient}>
                    <Modal.Header className="modal-header" closeButton>
                        <Modal.Title className="modal-title">
                            {this.props.multiUpload ? 'Select Patient' : 'Check Patient'}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="modal-body du-patient">
                        <SelectPatient multiUpload={this.props.multiUpload} />
                    </Modal.Body>
                </Modal>
                <Row>
                    <Col xs={12} md={8}>
                        <BootstrapTable
                            keyField='studyInstanceUID'
                            classes="table table-borderless"
                            bodyClasses="du-studies-tbody"
                            headerClasses="du-studies th"
                            rowClasses={this.rowClasses}
                            wrapperClasses="table-responsive"
                            data={this.props.studiesRows}
                            columns={this.columns}
                            selectRow={this.selectRow}
                        />

                    </Col>
                    <Col xs={6} md={4}>
                        <DisplayWarning type='study' selectionID={this.props.selectedStudy} multiUpload={this.props.multiUpload} />
                    </Col>
                </Row>
            </Container>
        )
    }
}

const mapStateToProps = state => {
    return {
        selectedStudy: state.DisplayTables.selectedStudy,
        studiesReady: state.DisplayTables.studiesReady
    }
}
const mapDispatchToProps = {
    selectStudy,
    addStudyReady,
    removeStudyReady
}

export default connect(mapStateToProps, mapDispatchToProps)(StudiesTab)