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
import { Button, Container, Row, Col } from 'react-bootstrap'
import ControllerSelectPatient from './ControllerSelectPatient'
import DisplayWarning from './DisplayWarning'
import { connect } from 'react-redux';
import { selectStudy, addStudyReady, removeStudyReady } from '../actions/DisplayTables'

class StudiesTab extends Component {

    state = {
        //Status of CheckPatient modal
        isToggled: false,
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
                if (this.props.studiesRows[rowIndex].warnings !== undefined) {
                    if (this.props.studiesRows[rowIndex].warnings['ALREADY_KNOWN_STUDY'] !== undefined) return (<></>)
                    if ((this.props.studiesRows[rowIndex].warnings['NOT_EXPECTED_VISIT'] !== undefined && !this.props.studiesRows[rowIndex].warnings['NOT_EXPECTED_VISIT'].dismissed)
                    || (this.props.studiesRows[rowIndex].warnings['NULL_VISIT_ID'] !== undefined && !this.props.studiesRows[rowIndex].warnings['NULL_VISIT_ID'].dismissed)) {
                        return (<Button onClick={() => { this.toggleCheckPatient(); }}>
                            {(this.props.multiUpload) ? 'Select Patient' : 'Check Patient'}
                        </Button>)
                    }
                }
                return (<></>)
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
    toggleCheckPatient = () => {
        this.setState( (state) => { return { isToggled: !state.isToggled } } )
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

    render() {
        return (
            <Container fluid>
                <span className='title'>Studies</span>
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
                        <ControllerSelectPatient multiUpload={this.props.multiUpload} show={this.state.isToggled} closeListener={() => this.toggleCheckPatient()} checkStudyReady={(studyID) => this.props.checkStudyReady(studyID)} />
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