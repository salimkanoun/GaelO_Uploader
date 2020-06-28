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

import DisplayWarning from './DisplayWarning'

export default class DisplayStudies extends Component {

    state = {
        isCheck: false,
    }

    columns = [
        {
            dataField: 'studyUID',
            hidden: true,
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
    ]

    
    selectRow = {
        mode: 'radio',
        clickToSelect: true,
        hideSelectColumn : true,
        onSelect: (row) => {
            console.log(row)
            this.props.onSelectChange(row.studyUID)
        }
    };

    toogleCheckPatient(row){
        console.log(row)

    }

    linkCheck = (row) => {
        return (
            <Fragment>
                <Button onClick={() => { this.toogleCheckPatient(row); }}>
                    Check Patient
                </Button>
                <CheckPatient studyUID = {this.row.studyUID} validateCheckPatient = {this.props.validateCheckPatient} display={this.state.isCheck} closeListener={() => this.toogleCheckPatient(row) } studies={this.props.studies} />
            </Fragment>
        );
    };

    render() {
        console.log(this.props.studies)
        return (
            <Fragment>
                 <Container fluid>
                    <span class="title">Studies</span>
                    <Row>
                        <Col xs={12} md={8}>
                            <BootstrapTable
                                keyField='studyUID'
                                classes="table table-borderless"
                                bodyClasses="du-studies-tbody"
                                headerClasses="du-studies th"
                                rowClasses="du-studies td"
                                data={this.props.studies}
                                columns={this.columns}
                                selectRow={this.selectRow}
                            />
                        </Col>
                        <Col xs={6} md={4}>
                           
                        </Col>
                    </Row>
                </Container>
            </Fragment>
        )
    }
}

