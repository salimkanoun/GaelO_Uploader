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
import { Container, Row, Col } from 'react-bootstrap'
import DisplayWarning from './DisplayWarning'
import { connect } from 'react-redux';
import { selectSeriesReady, selectSeries } from './actions/DisplayTables'

class DisplaySeries extends Component {

    columns = [
            {
                dataField: 'seriesInstanceUID',
                isDummyField: true,
                hidden: true,
            },
            {
                dataField: 'selectedSeries',
                text: '',
                formatExtraData: this,
                formatter: (cell, row, rowIndex, formatExtraData) => {
                    let checked = row.selectedSeries
                    return (
                        <input disabled={row.status === 'Rejected'} checked={checked} type='checkbox' onChange={() => { formatExtraData.props.selectSeriesReady(row.seriesInstanceUID, !checked) }} />
                    )
                }
            },
            {
                dataField: 'status',
                text: 'Status',
                editable: false
            },
            {
                dataField: 'seriesDescription',
                text: 'Description',
                editable: false,
                style: { whiteSpace: 'normal', wordWrap: 'break-word' },
            },
            {
                dataField: 'modality',
                text: 'Modality',
                editable: false,
            },
            {
                dataField: 'seriesNumber',
                text: 'Number #',
                editable: false,
            },
            {
                dataField: 'seriesDate',
                text: 'Date',
                editable: false,
            },
            {
                dataField: 'numberOfInstances',
                text: 'Nb of Instances',
                editable: false,
            },
        ]

    selectRow = {
        mode: 'radio',
        clickToSelect: true,
        clickToEdit: true,
        hideSelectColumn: true,
        classes: "row-clicked",
        selected: this.selectedSeries,
        onSelect: (row, isSelect) => {
            this.props.selectSeries(row.seriesInstanceUID)
        }
    }



    render() {
        return (
            <Container fluid>
                <span className="title">Series</span>
                <Row>
                    <Col xs={12} md={8}>
                        <BootstrapTable
                            keyField='seriesInstanceUID'
                            classes="table table-borderless"
                            bodyClasses="du-series-tbody"
                            headerClasses="du-series th"
                            rowClasses={rowClasses}
                            wrapperClasses="table-responsive"
                            data={this.props.seriesRows}
                            columns={this.columns}
                            selectRow={this.selectRow} />
                    </Col>
                    <Col xs={6} md={4}>
                        <DisplayWarning
                            type='series'
                            selectionID={this.props.selectedSeries}
                        />
                    </Col>
                </Row>
            </Container>
        )
    }
}

const rowClasses = (row, rowIndex) => {
    if (row.status === 'Rejected') return 'du-series row-danger'
    if (row.status === 'Valid' && row.selectedSeries === true) return 'du-series row-success'
    return 'du-series td'
}


const mapStateToProps = state => {
    return {
        selectedSeries: state.DisplayTables.selectedSeries,
    }
}
const mapDispatchToProps = {
    selectSeriesReady,
    selectSeries
}

export default connect(mapStateToProps, mapDispatchToProps)(DisplaySeries)