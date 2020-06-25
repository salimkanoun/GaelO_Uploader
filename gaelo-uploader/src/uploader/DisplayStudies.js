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

import React, { Component, Fragment } from 'react'
import BootstrapTable from 'react-bootstrap-table-next';
import Button from 'react-bootstrap/Button'
import CheckPatient from './CheckPatient'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
export default class DisplayStudies extends Component {

    constructor(props) {
        super(props);
        this.state = {

            columns: [
                {
                    dataField: 'studyUID',
                    text: '',
                    formatter: this.linkCheck,
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
            ],
            isCheck: false,
            currentSelectedStudyId: ''
        }
        this.onCheckChanged = this.onCheckChanged.bind(this);
    }

    warnings = [
        {
            dataField: 'warnings',
            text: 'Warnings',
        },
    ];

    selectRow = {
        mode: 'radio',
        clickToSelect: true,
        onSelect: (row) => {
            this.state.currentSelectedStudyId = row.studyUID
            this.sendData()
        }
    };

    onCheckChanged() {
        this.setState({ isCheck: !this.state.isCheck });
    }

    linkCheck = (row) => {
        return (
            <Button onClick={() => { this.onCheckChanged(row); }}>
                Check Patient
            </Button>
        );
    };

    getDate(date) {
        let rawDate = String(date);
        return (rawDate.substring(0, 4) + '-' + rawDate.substring(4, 6) + '-' + rawDate.substring(6, 8))
    }

    formatDate() {
        let data = this.props.studies.allStudies()
        let date = {}
        for (let element in data) {
            let tempObj = data[element]
            for (let e in tempObj) {
                if (e == 'studyDate') {
                    date[element] = (tempObj[e])
                }
            }
        }
        return date
    }

    getData() {
        return Object.values(this.props.studies.allStudies())
    }

    sendData = () => { this.props.handleToUpdate(this.state.currentSelectedStudyId) }

    render() {
        return (
            <>
                <CheckPatient display={this.state.isCheck} closeListener={this.onCheckChanged} studies={this.props.studies} studyID={this.state.currentSelectedStudyId} />
                <Container fluid>
                    <span class="title">Study</span>
                    <Row>
                        <Col xs={12} md={8}>
                            <BootstrapTable
                                keyField='id'
                                classes="table table-responsive table-borderless"
                                bodyClasses="du-studies-tbody"
                                data={this.getData()}
                                columns={this.state.columns}
                                selectRow={this.selectRow}
                            />
                        </Col>
                        <Col xs={6} md={4}>
                            <BootstrapTable
                                keyField='id'
                                classes="table table-responsive table-borderless"
                                bodyClasses="du-studies-warnings"
                                data={this.getData()}
                                columns={this.warnings} />
                        </Col>
                    </Row>
                </Container>
            </>
        )
    }
}

