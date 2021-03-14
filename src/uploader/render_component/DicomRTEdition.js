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
import { connect } from 'react-redux'

import Select from 'react-select'
import BootstrapTable from 'react-bootstrap-table-next'

class DicomRTEdition extends Component {

    state = {
        newROIName: {}
    }

    columns = [
        {
            dataField: 'ROINumber',
            text: 'Roi Number',
            editable: false
        },
        {
            dataField: 'ROIName',
            text: 'ROI Name',
            editable: false
        },
        {
            dataField: 'newName',
            text: 'New ROI Name',
            isDummyField: true,
            formatter: (cell, row, rowIndex) => {

                let onChange = (value, meta) => {
                    if (meta.action === "clear") {
                        this.setState((state) => {
                            delete state['newROIName'][row.ROINumber]
                            return state
                        })
                    } else {
                        this.setState((state) => {
                            state['newROIName'][row.ROINumber] = value.value
                            return state
                        })
                    }

                }

                return (
                    <Select
                        options={[{ label: "Liver", value: "Liver" }, { label: "Head", value: "Head" }]}
                        onChange={onChange}
                        isClearable={true}
                        isSearchable={true}
                    />
                )

            }
        }
    ]

    selectRow = {
        mode: 'radio',
        clickToSelect: true,
        clickToEdit: true,
        hideSelectColumn: true,
        classes: "row-clicked"
    }

    render() {
        return (
            <Fragment>
                <BootstrapTable
                    keyField='ROINumber'
                    classes="table table-borderless"
                    wrapperClasses="table-responsive"
                    data={this.props.series[this.props.selectedSeries]['structureSetROISequence']}
                    columns={this.columns}
                    selectRow={this.selectRow} />
            </Fragment>
        )
    }
}


const mapStateToProps = state => {
    return {
        selectedSeries: state.DisplayTables.selectedSeries,
        series: state.Series.series
    }
}

export default connect(mapStateToProps, null)(DicomRTEdition)