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
import DisplayWarning from './DisplayWarning'
//Redux
import { connect } from 'react-redux';
import { selectSeries } from './actions/DisplayTables'

class DisplaySeries extends Component {

    //USE REDUX STATE
    state = {
        selectedSeries: []
    }

    columns = [
        {
            dataField: 'seriesInstanceUID',
            isDummyField: true,
            hidden: true
        },
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
            dataField: 'seriesNumber',
            text: 'Number #',
        },
        {
            dataField: 'seriesDate',
            text: 'Date',
        },
        {
            dataField: 'numberOfInstances',
            text: 'Nb of Instances',
        },
    ];

    selectRow = {
        mode: 'checkbox',
        clickToSelect: true,
        selected: this.selectedSeries,
        onSelect: (row, isSelect) => {
            //ICI FAIRE REMONTER L INFO QUE L UPLAD EST A FAIREs
            if (isSelect) {
                this.setState((prevState) => ({ selectedSeries: [...prevState.selectedSeries, row.seriesInstanceUID] }),
                    () => (this.props.selectedSeries(this.state.selectedSeries)))
            } else {
                this.setState((prevState) => ({ selectedSeries: prevState.selectedSeries.filter(thisRow => thisRow !== row.seriesInstanceUID) }),
                    () => (this.props.selectedSeries(this.state.selectedSeries)))
            }
        }
    }

    buildRows() {
        let rows = []
        this.props.seriesFromParent.forEach(series => {
            rows.push({
                ...this.props.series[series],
                numberOfInstances: this.props.series.numberOfInstances
            })
        })
        return rows
    }

    render() {
        console.log(this.props.series)
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
                            data={this.buildRows()}
                            columns={this.columns}
                            selectRow={this.selectRow} />
                    </Col>
                    <Col xs={6} md={4}>
                    <DisplayWarning type='series' object={(this.props.series.length !== 0) ? this.props.seriesFromParent : null} 
                    />
                    </Col>
                </Row>
            </Container>
        )
    }
}

const mapStateToProps = state => {
    return {
        series: state.Model.series,
        selectedSeries: state.DisplayTables.selectedSeries
    }
}
const mapDispatchToProps = {
    selectSeries
}

export default connect(mapStateToProps, mapDispatchToProps)(DisplaySeries)