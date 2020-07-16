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
import { selectSeries, seriesReady } from './actions/DisplayTables'

class DisplaySeries extends Component {

    columns = [
        {
            dataField: 'seriesInstanceUID',
            isDummyField: true,
            hidden: true,
            
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
        classes: "row-clicked",
        selected: this.selectedSeries,
        onSelect: (row, isSelect) => {
            //ICI FAIRE REMONTER L INFO QUE L UPLAD EST A FAIREs
            this.props.selectSeries(row, isSelect)
            if (row.dismissed) {
                this.props.seriesReady(row, isSelect)
            }
        }
    }

    buildRows(selectedStudy) {
        if (selectedStudy !== null && selectedStudy !== undefined) {
            let seriesArray = []
            let seriesToDisplay = Object.keys(this.props.studies[selectedStudy].series)
            seriesToDisplay.forEach((series) => {
                let seriesToPush = this.props.series[series]
                seriesToPush['status'] = (this.warningsPassed(series)) ? 'Valid' : 'Rejected'
                seriesArray.push({
                    ...seriesToPush
                })
            }
            )
            return seriesArray
        }
        else return []
    }

    warningsPassed(series) {
        for (let warning in this.props.series[series].warnings) {
            if (!this.props.series[series].warnings[warning].dismissed) {
                return false
            }
        }
        return true
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
                            wrapperClasses="table-responsive"
                            keyField='seriesInstanceUID'
                            data={this.buildRows(this.props.selectedStudy)}
                            columns={this.columns}
                            selectRow={this.selectRow} />
                    </Col>
                    <Col xs={6} md={4}>
                        <DisplayWarning type='series' selectionID={this.props.selectedSeries[(this.props.selectedSeries.length)-1]} />
                    </Col>
                </Row>
            </Container>
        )
    }
}

const mapStateToProps = state => {
    return {
        series: state.Series.series,
        studies: state.Studies.studies,
        selectedSeries: state.DisplayTables.selectedSeries
    }
}
const mapDispatchToProps = {
    selectSeries,
    seriesReady
}

export default connect(mapStateToProps, mapDispatchToProps)(DisplaySeries)