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

    state = {
        hiddenCells: [false, false, false, false, false],
        columns: [
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
                hidden: false
            },
            {
                dataField: 'modality',
                text: 'Modality',
                editable: false,
                hidden: false
            },
            {
                dataField: 'seriesNumber',
                text: 'Number #',
                editable: false,
                hidden: false
            },
            {
                dataField: 'seriesDate',
                text: 'Date',
                editable: false,
                hidden: false
            },
            {
                dataField: 'numberOfInstances',
                text: 'Nb of Instances',
                editable: false,
                hidden: false
            },
        ]
    }

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

    updateHiddenColumns = (newState, index) => {
        let newArray = this.state.columns
        let newObj = newArray[index]
        newObj.hidden = newState
        newArray[index] = newObj
        console.log(newArray)
        this.setState({ columns: newArray })
    }

    render() {
        return (
            <Container fluid>
                <span className="title">Series</span>
                <div className='options'>
                    <span className='du-series'>Hide columns:  </span>
                    <input type='checkbox' onChange={(event) => { this.updateHiddenColumns(event.target.checked, 3) }} /><label class='series-table-options'>Description</label>
                    <input type='checkbox' onChange={(event) => { this.updateHiddenColumns(event.target.checked, 4) }} /><label class='series-table-options'>Modality</label>
                    <input type='checkbox' onChange={(event) => { this.updateHiddenColumns(event.target.checked, 5) }} /><label class='series-table-options'>Number #</label>
                    <input type='checkbox' onChange={(event) => { this.updateHiddenColumns(event.target.checked, 6) }} /><label class='series-table-options'>Date</label>
                    <input type='checkbox' onChange={(event) => { this.updateHiddenColumns(event.target.checked, 7) }} /><label class='series-table-options'>Nb of instances</label>
                </div>
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
                            columns={this.state.columns}
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