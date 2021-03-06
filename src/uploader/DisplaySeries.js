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
import { connect } from 'react-redux'

import BootstrapTable from 'react-bootstrap-table-next';
import { Container, Row, Col, Button, Modal } from 'react-bootstrap'

import Util from '../model/Util'
import { addSeriesReady, removeSeriesReady, selectSeries } from '../actions/DisplayTables'
import DisplayWarning from './DisplayWarning'
import { Fragment } from 'react';
import SeriesEdition from './render_component/SeriesEdition';



class DisplaySeries extends Component {

    state = {
        showEditSeries : null
    }

    columns = [
            {
                dataField: 'seriesInstanceUID',
                isDummyField: true,
                hidden: true,
            },
            {
                dataField: 'selectedSeries',
                text: '',
                formatter: (cell, row, rowIndex, formatExtraData) => {
                    if (row.status === 'Known study') return <> </>
                    return (
                        <input disabled={row.status === 'Rejected'} 
                            checked={this.props.seriesReady.includes(row.seriesInstanceUID)} 
                            type='checkbox' 
                            onChange={(event) => {
                                    if (event.target.checked) this.props.addSeriesReady(row.seriesInstanceUID)
                                    else this.props.removeSeriesReady(row.seriesInstanceUID)
                            }} 
                        />
                    )
                }
            },
            {
                dataField: 'status',
                text: 'Status',
                editable: false,
                formatter: (cell, row, rowIndex, extraData) => {
                    return (
                        <div>
                        <Button variant={cell === 'Valid' ? 'success' : 'danger'} onClick={() => {
                        this.setState({
                            showEditSeries : row.seriesInstanceUID
                        })
                        }}>
                            {cell}
                        </Button>
                    </div>)
                }
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
                text: 'Series Number',
                editable: false,
            },
            {
                dataField: 'seriesDate',
                text: 'Date',
                editable: false,
                formatter: (cell, row, rowIndex, extraData) => {
                    return Util.formatRawDate(cell)
                }
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

    getSeriesRowClasses = (row, rowIndex) => {
        if (row.status === 'Rejected') return 'du-series row-danger'
        if (row.status === 'Valid' && row.selectedSeries === true) return 'du-series row-success'
        return 'du-series td'
    }

    closeEditSeries = () => {
        this.setState({
            showEditSeries : null
        })
    }



    render() {
        return (
            <Fragment>
                <Modal show={this.state.showEditSeries != null} onHide={this.closeEditSeries}>
                    <Modal.Header className="modal-header" closeButton>
                        <Modal.Title className="modal-title">
                            Edit Series Tag
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="modal-body du-patient">
                        <SeriesEdition
                            seriesDetails = {this.props.series[this.state.showEditSeries]}
                        />
                    </Modal.Body>
                </Modal>

                <Container fluid>
                    <span className="title">Series</span>
                    <Row>
                        <Col xs={12} md={8}>
                            <BootstrapTable
                                keyField='seriesInstanceUID'
                                classes="table table-borderless"
                                bodyClasses="du-series-tbody"
                                headerClasses="du-series th"
                                rowClasses={this.getSeriesRowClasses}
                                wrapperClasses="table-responsive"
                                data={this.props.seriesRows}
                                columns={this.columns}
                                selectRow={this.selectRow} />
                        </Col>
                        <Col xs={6} md={4}>
                            <DisplayWarning
                                type='series'
                            />
                        </Col>
                    </Row>
                </Container>
            </Fragment>
        )
    }
}


const mapStateToProps = state => {
    return {
        selectedSeries: state.DisplayTables.selectedSeries,
        seriesReady: state.DisplayTables.seriesReady,
        series: state.Series.series
    }
}
const mapDispatchToProps = {
    addSeriesReady,
    removeSeriesReady,
    selectSeries
}

export default connect(mapStateToProps, mapDispatchToProps)(DisplaySeries)