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
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

export default class DisplaySeries extends Component {

    state = {
        currentSelectedStudyIds: [],
    }

    columns = [
        {
            dataField: 'status',
            text: 'Status',
        },
        {
            dataField: 'seriesDescription',
            text: 'Description',
        },
        {
            dataField: 'modality',
            text: 'Modality',
        },
        {
            dataField: 'accessionNumber',
            text: '#',
        },
        {
            dataField: 'acquisitionDate',
            text: 'Date',
        },
        {
            dataField: 'instances',
            text: 'Nb of Instances',
        },

    ];

    warnings = [
        {
            dataField: 'warnings',
            text: 'Warnings',
        },
    ];

    selectRow = {
        mode: 'checkbox',
        clickToSelect: true,
        onSelect: (row, isSelect) => {
            if (isSelect) {
                this.state.currentSelectedStudyIds.push(row.seriesInstanceUID)
            } else {
                for (let e in this.state.currentSelectedStudyIds) {
                    if (this.state.currentSelectedStudyIds[e] === row.seriesInstanceUID) {
                        this.state.currentSelectedStudyIds.splice(e, 1)
                    }
                }
            }
        }
    };

    getSeries() {
        let series = this.props.studies.allStudies()
        let seriesData = []
        for (let e in series[this.props.studyID]) {
            if (e === 'series') {
                series = series[this.props.studyID][e]
                for (let element in series) {
                    let nbInstances = 0
                    for (let instances in series[element].instances) {
                        nbInstances++
                    }
                    seriesData.push({
                        seriesInstanceUID: series[element].seriesInstanceUID,
                        status: null, seriesDescription: series[element].seriesDescription, modality: series[element].modality,
                        accessionNumber: series[element].seriesNumber, acquisitionDate: series[element].seriesDate, instances: nbInstances
                    })
                }
            }
        }
        return seriesData
    }

    render() {
        return (
            <Container fluid>
                <span class="title">Series</span>
                <Row>
                    <Col xs={12} md={8}>
                        <BootstrapTable
                            classes="table table-borderless"
                            bodyClasses="du-series-tbody"
                            headerClasses="du-series th"
                            rowClasses="du-series td"
                            keyField='seriesInstanceUID'
                            data={Object.values(this.getSeries())}
                            columns={this.columns}
                            selectRow={this.selectRow} />
                    </Col>
                    <Col xs={6} md={4}>
                        <BootstrapTable
                            keyField='id'
                            classes="table table-borderless"
                            bodyClasses="du-series-warnings"
                            headerClasses="du-series-warnings th"
                            data={Object.values(this.props.studies.allStudies())}
                            columns={this.warnings} />
                    </Col>
                </Row>
            </Container>
        )
    }

}