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
import { connect } from 'react-redux';

import { Button, Container, Row, Col, Modal } from 'react-bootstrap'
import BootstrapTable from 'react-bootstrap-table-next';

import DisplayWarning from './DisplayWarning'
import SelectPatient from './SelectPatient'

import { selectStudy, addStudyReady, removeStudyReady } from '../actions/DisplayTables'
import { unsetVisitID } from '../actions/Studies'
import Util from '../model/Util';

class StudiesTab extends Component {

    state = {
        showSelectPatient: false,
    }

    columns = [
        {
            dataField: 'selectedStudies',
            text: '',
            hidden: (!this.props.multiUpload),
            formatter: (cell, row, rowIndex, formatExtraData) => {
                return (
                    <input disabled={row.status !== 'Valid'}
                        type='checkbox'
                        checked={this.props.studiesReady.includes(row.studyInstanceUID)}
                        onChange={(event) => {
                            if (event.target.checked) this.props.addStudyReady(row.studyInstanceUID)
                            else this.props.removeStudyReady(row.studyInstanceUID)
                        }} />
                )
            }
        },
        {
            dataField: 'studyInstanceUID',
            hidden: true
        },
        {
            dataField: 'visitAssignement',
            isDummyField : true,
            text: 'Assign',
            formatter: (cell, row, rowIndex, extraData) => {
                if (this.props.warningsStudies[row.studyInstanceUID] !== undefined ) {
                    if (this.props.warningsStudies[row.studyInstanceUID]['ALREADY_KNOWN_STUDY'] !== undefined)
                        return (<></>)
                    else if (this.props.warningsStudies[row.studyInstanceUID]['NULL_VISIT_ID'] !== undefined ) {
                        return (
                            <Button variant="primary" onClick={this.toggleSelectPatient} block>
                                {(this.props.multiUpload) ? 'Select Patient' : 'Check Patient'}
                            </Button>
                        )
                    }
                   
                } else {

                    return (
                        <Button variant="success" 
                                onClick={() => {
                                    this.props.unsetVisitID(row.studyInstanceUID, row.visitID)
                                    this.props.removeStudyReady(row.studyInstanceUID)
                                    }
                                }
                                block
                                >
                            Done
                        </Button>
                    )
                    
                }

            }
        },
        {
            dataField: 'status',
            text: 'Status',
        },
        {
            dataField: 'patientName',
            text: 'Patient Name',
            style: { whiteSpace: 'normal', wordWrap: 'break-word' }
        },
        {
            dataField: 'studyDescription',
            text: 'Description',
            style: { whiteSpace: 'normal', wordWrap: 'break-word' }
        },
        {
            dataField: 'accessionNumber',
            text: 'Accession',
            style: { whiteSpace: 'normal', wordWrap: 'break-word' }
        },
        {
            dataField: 'acquisitionDate',
            text: 'Date',
            formatter: (cell, row, rowIndex, extraData) => {
                return Util.formatRawDate(cell)
            }
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
     * Toggle modal 'CheckPatient' 
     * 
     */
    toggleSelectPatient = () => {
        this.setState((state) => { return { showSelectPatient: !state.showSelectPatient } })
    }

    getRowClasses = (row) => {
        let className = ['du-studies']

        if (row.status === 'Rejected') className.push('row-danger')
        else if (row.status === 'Incomplete' || row.status === 'Already Known') className.push('row-warning')
        else if (row.status === 'Valid' && row.selectedStudies === true) className.push('row-success')
        else className.push('td')

        if (row.studyInstanceUID === this.props.selectedStudy) className.push('row-clicked')

        return className.join(' ')
    }

    render() {
        return (
            <>
                <Modal show={this.state.showSelectPatient} onHide={this.toggleSelectPatient}>
                    <Modal.Header className="modal-header" closeButton>
                        <Modal.Title className="modal-title">
                            Select Patient
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="modal-body du-patient">
                        <SelectPatient multiUpload={this.props.multiUpload} onValidate={this.toggleSelectPatient} />
                    </Modal.Body>
                </Modal>

                <Container fluid>
                    <span className='title'>Studies</span>
                    <Row>
                        <Col xs={12} md={8}>
                            <BootstrapTable
                                keyField='studyInstanceUID'
                                classes="table table-borderless"
                                bodyClasses="du-studies-tbody"
                                headerClasses="du-studies th"
                                rowClasses={this.getRowClasses}
                                wrapperClasses="table-responsive"
                                data={this.props.studiesRows}
                                columns={this.columns}
                                selectRow={this.selectRow}
                            />
                        </Col>
                        <Col xs={6} md={4}>
                            <DisplayWarning type='study' />
                        </Col>
                    </Row>
                </Container>
            </>
        )
    }
}

const mapStateToProps = state => {
    return {
        selectedStudy: state.DisplayTables.selectedStudy,
        studiesReady: state.DisplayTables.studiesReady,
        warningsStudies: state.WarningsStudy.warningsStudy,
        studies: state.Studies.studies,
    }
}
const mapDispatchToProps = {
    selectStudy,
    addStudyReady,
    removeStudyReady,
    unsetVisitID
}

export default connect(mapStateToProps, mapDispatchToProps)(StudiesTab)