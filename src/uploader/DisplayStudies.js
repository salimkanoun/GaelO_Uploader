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
import { unsetVisitID } from '../actions/Studies'

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
            text: '',
            hidden: false,
            formatter: (cell, row, rowIndex, extraData) => {
                if (!Util.isEmptyObject(this.props.warningsStudies[row.studyInstanceUID])) {
                    if (this.props.warningsStudies[row.studyInstanceUID]['ALREADY_KNOWN_STUDY'] !== undefined)
                        return (<></>)
                    else if (this.props.warningsStudies[row.studyInstanceUID]['NULL_VISIT_ID'] !== undefined ) {
                        return (
                            <Button variant="primary" onClick={this.toggleSelectPatient}>
                                {(this.props.multiUpload) ? 'Select Patient' : 'Check Patient'}
                            </Button>
                        )
                    }
                    else if (this.props.warningsStudies[row.studyInstanceUID]['NULL_VISIT_ID'] === undefined ) {
                        return (
                            <Button variant="warning" 
                                    onClick={() => {
                                        this.props.unsetVisitID(row.studyInstanceUID, row.idVisit)
                                        this.props.removeStudyReady(row.studyInstanceUID)
                                        }
                                    }>
                                Reset Patient
                            </Button>
                        )
                    }
                } else {
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
            text: 'Accession Nb',
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
            console.log(row)
            this.props.selectStudy(row.studyInstanceUID)
        }
    };

    /**
     * Toggle modal 'CheckPatient' 
     * 
     */
    toggleSelectPatient = () => {
        console.log('toogle')
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
                            Select/Check Patient
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="modal-body du-patient">
                        <SelectPatient multiUpload={this.props.multiUpload} onValidate={this.toggleSelectPatient}/>
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
                            <DisplayWarning type='study' selectionID={this.props.selectedStudy} multiUpload={this.props.multiUpload} />
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