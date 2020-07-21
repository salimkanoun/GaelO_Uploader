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
import { checkPatientData } from './actions/Warnings'
const labels = ['First Name', 'Last Name', 'Birth Date', 'Sex', 'Acquisition Date']
const keys = ['patientFirstName', 'patientLastName', 'patientBirthDate', 'patientSex', 'acquisitionDate']
class StudiesTab extends Component {

    state = {
        isCheck: false,
    }

    constructor(props) {
        super(props)
        this.toggleCheckPatient = this.toggleCheckPatient.bind(this)
        this.myRef = React.createRef()
    }

    columns = [
        {
            dataField: 'studyInstanceUID',
            isDummyField: true,
            hidden: false,
            formatter: (cell, row, rowIndex, extraData) => (
                <Button onClick={() => { this.toggleCheckPatient(row); }}>
                    {(this.props.multiUploader) ? 'Select Patient' : 'Check Patient'}
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
        onSelect: async (row) => {
            await this.props.selectStudy(row.studyInstanceUID)
            if (!this.props.studies[row.studyInstanceUID].warnings['NOT_EXPECTED_VISIT'].dismissed)
                this.prepareDataCheckPatient()
        }
    };

    /**
     * Toggle modal 'CheckPatient' of given row 
     */
    toggleCheckPatient() {
        this.setState((state) => { return { isCheck: !state.isCheck } })
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
     * Check matching of patient information
     */
    prepareDataCheckPatient() {
        let rows = []
        let currentStudy = this.props.studies[this.props.selectedStudy]
        //SK ICI patientName peut etre undefined (donc crash ici)
        //Peut etre plutot a gerer quand on construit l'entree study mettre les
        //caractères recherchés pour le match
        currentStudy.patientFirstName = currentStudy.patientFirstName.slice(0, 1)
        currentStudy.patientLastName = currentStudy.patientLastName.slice(0, 1)

        let expectedStudy = [currentStudy]

        //Fake unmatching fields
        expectedStudy.patientFirstName = 'A'
        expectedStudy.patientSex = 'M'
        expectedStudy.patientBirthDate = '2000-01-01'

        for (let i in labels) {
            rows.push({
                rowName: labels[i],
                expectedStudy: expectedStudy[keys[i]],
                currentStudy: currentStudy[keys[i]],
            })
        }
        this.props.checkPatientData(rows)
    }
    
    /**
     * Check the study status according to its warnings and its series' warnings 
     */
    warningsPassed(study) {
        let studyStatus = 'Valid'
        //Check for warnings in study
        for (let warning in this.props.warningsStudies[study]) {
            if (!this.props.warningsStudies[study][warning].dismissed) {
                studyStatus = 'Rejected'
                return studyStatus
            }
        }
        //Check for warnings in series
        for (let series in this.props.series) {
            if (Object.keys(this.props.studies[study].series).includes(series)) {
                for (let warning in this.props.warningsSeries[series]) {
                    if (!this.props.warningsSeries[series][warning].dismissed) {
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
                    <span className='title'>Studies</span>
                    <Row>
                        <Col xs={12} md={8}>
                            <BootstrapTable
                                keyField='studyInstanceUID'
                                classes="table table-borderless"
                                bodyClasses="du-studies-tbody"
                                headerClasses="du-studies th"
                                rowClasses= { rowClasses }
                                data={this.getStudies()}
                                columns={this.columns}
                                selectRow={this.selectRow}
                                wrapperClasses="table-responsive"
                            />
                            <CheckPatient multiUploader={this.props.multiUploader} show={this.state.isCheck} closeListener={() => this.toggleCheckPatient()} buildRows={this.props.buildRows} hidden={this.props.validatedPatient}/>
                        </Col>
                        <Col xs={6} md={4}>
                            <DisplayWarning type='study' selectionID={this.props.selectedStudy}/>
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
        warningsSeries: state.Warnings.warningsSeries,
        warningsStudies: state.Warnings.warningsStudies,
        checkPatientDataTable: state.Warnings.checkPatientDataTable
    }
}
const mapDispatchToProps = {
    selectStudy,
    checkPatientData
}

export default connect(mapStateToProps, mapDispatchToProps)(StudiesTab)