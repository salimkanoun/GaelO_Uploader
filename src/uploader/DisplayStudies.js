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
import Button from 'react-bootstrap/Button'
import CheckPatient from './CheckPatient'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import DisplayWarning from './DisplayWarning'
//Redux
import { connect } from 'react-redux';
import { selectStudy, selectStudiesReady } from './actions/DisplayTables'

class StudiesTab extends Component {

    state = {
        isCheck: false,
    }

    constructor(props) {
        super(props)
        this.toggleCheckPatient = this.toggleCheckPatient.bind(this)
    }

    columns = [
        {
            dataField: 'selectedStudies',
            text: 'Select',
            hidden: false,
            formatExtraData: this,
            formatter: (cell, row, rowIndex, formatExtraData) => {
                let checked = row.selectedStudies
                return (
                    <input disabled={row.status !== 'Valid'} checked={checked} type="checkbox" onChange={() => { formatExtraData.props.selectStudiesReady(row.studyInstanceUID, !checked) }} />
                )
            }
        },
        {
            dataField: 'studyInstanceUID',
            text: '',
            hidden: false,
            formatter: (cell, row, rowIndex, extraData) => ((this.props.studiesRows[rowIndex].warnings !== undefined 
                && !this.props.studiesRows[rowIndex].warnings['NOT_EXPECTED_VISIT'].dismissed) ?  
                <Button onClick={() => { this.toggleCheckPatient(); }}>
                    {(this.props.multiUpload) ? 'Select Patient' : 'Check Patient'}
                </Button> : <></>
            ),
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
        classes: "row-clicked",
        onSelect: (row) => {
            this.props.selectStudy(row.studyInstanceUID)
        }
    };

    /**
     * Toggle modal 'CheckPatient' of given row 
     */
    toggleCheckPatient() {
        this.setState((state) => { return { isCheck: !state.isCheck } })
    }

    render() {
        return (
            <>
                <Container fluid>
                    <span className='title'>Studies</span>
                    <Row>
                        <Col xs={12} md={8}>
                            <BootstrapTable
                                keyField='studyInstanceUID'
                                classes="table table-borderless"
                                bodyClasses="du-studies-tbody"
                                headerClasses="du-studies th"
                                rowClasses={rowClasses}
                                data={this.props.studiesRows}
                                columns={this.columns}
                                selectRow={this.selectRow}
                                wrapperClasses="table-responsive"
                            />
                            <CheckPatient multiUpload={this.props.multiUpload} show={this.state.isCheck} closeListener={() => this.toggleCheckPatient()} />
                        </Col>
                        <Col xs={6} md={4}>
                            <DisplayWarning type='study' selectionID={this.props.selectedStudy} multiUpload={this.props.multiUpload}/>
                        </Col>
                    </Row>
                </Container>

            </>
        )
    }
}

const rowClasses = (row, rowIndex) => {
    if (row.status === 'Rejected')
        return 'du studies row-danger'
    if (row.status === 'Incomplete')
        return 'du-studies row-warning'
    return 'du-studies td'
}

const mapStateToProps = state => {
    return {
        selectedStudy: state.DisplayTables.selectedStudy,
    }
}
const mapDispatchToProps = {
    selectStudy,
    selectStudiesReady
}

export default connect(mapStateToProps, mapDispatchToProps)(StudiesTab)