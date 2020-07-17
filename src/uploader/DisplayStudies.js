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
import { selectStudy } from './actions/DisplayTables'

import { validateCheckPatient } from './actions/StudiesSeries'

class StudiesTab extends Component {

    state = {
        isCheck: false,
    }

    constructor(props) {
        super(props)
        this.validateCheckPatient = this.validateCheckPatient.bind(this)
        this.toggleCheckPatient = this.toggleCheckPatient.bind(this)
    }

    columns = [
        {
            dataField: 'studyUID',
            isDummyField: true,
            hidden: false,
            formatter: (cell, row, rowIndex, extraData) => (
                <Button onClick={() => { this.toggleCheckPatient(row); }}>
                    Check Patient
                </Button>
            ),
        },
        {
            dataField: 'status',
            text: 'Status',
        },
        {
            dataField: 'patientName',
            text: 'Patient name',
        },
        {
            dataField: 'studyDescription',
            text: 'Description',
        },
        {
            dataField: 'accessionNumber',
            text: 'Accession #',
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
            this.props.selectStudy(row.studyUID)
        }
    };

    validateCheckPatient = (studyUID) => {

    }

    /**
     * Toggle modal 'CheckPatient' of given row 
     */
    toggleCheckPatient(row) {
        this.setState((state) => { return { isCheck: !state.isCheck } })
        return row
    }

    /**
     * Fetch studies from Redux State to display in table
     */
    getStudies() {
        let studies = []
        if (Object.keys(this.props.studies).length > 0) {
            for (let study in this.props.studies) {
                let tempStudy = this.props.studies[study]
                tempStudy['status'] = this.warningsPassed(study)
                studies.push({...tempStudy})
            }
        }
        return studies
    }

    /**
     * Rerender component if a different study has been selected 
     */
    componentDidUpdate(prevState) {
        if (this.props.selectedStudy !== undefined && prevState.series !== this.props.series) {
            this.render()
        }
    }

    /**
     * Check the study status according to its warnings and its series' warnings 
     */
    warningsPassed(study) {
        let studyStatus = 'Valid'
        //Check for warnings in study
        for (let warning in this.props.studies[study].warnings) {
            if (!this.props.studies[study].warnings[warning].dismissed) {
                studyStatus = 'Rejected'
            }
        }
        //Check for warnings in series
        for (let series in this.props.series) {
            if (Object.keys(this.props.studies[study].series).includes(series)) {
                for (let warning in this.props.series[series].warnings) {
                    if (!this.props.series[series].warnings[warning].dismissed) {
                        studyStatus = 'Incomplete'
                    }
                }
            }
        }
        return studyStatus 
    }

    render() {
        return (
            <>
                <Container fluid>
                    <span class='title'>Studies</span>
                    <Row>
                        <Col xs={12} md={8}>
                            <BootstrapTable
                                keyField='studyUID'
                                classes="table table-borderless"
                                bodyClasses="du-studies-tbody"
                                headerClasses="du-studies th"
                                rowClasses= { rowClasses }
                                data={this.getStudies()}
                                columns={this.columns}
                                selectRow={this.selectRow}
                                wrapperClasses="table-responsive"
                            />
                            <CheckPatient studyUID={this.props.selectedStudy} validateCheckPatient={this.validateCheckPatient}
                                show={this.state.isCheck} closeListener={() => this.toggleCheckPatient(this.selectedStudy)} hidden={this.props.validatedPatient}/>
                        </Col>
                        <Col xs={6} md={4}>
                            <DisplayWarning type='studies' selectionID={this.props.selectedStudy} />
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
    validateCheckPatient
}

export default connect(mapStateToProps, mapDispatchToProps)(StudiesTab)