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

export default class DisplayStudies extends Component {



    columns = [
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
            text: 'Accesion #',
        },
        {
            dataField: 'acquisitionDate',
            text: 'Date',
        },
        {
            dataField: 'warnings',
            text: 'Warnings',
        },
    ];

    getData() {
        let studyTemp = this.props.studies.allStudies();
        //let study = studyTemp[String(Object.keys(studyTemp))]
        //console.log("temp" + Object.values(study))
        return Object.values(this.props.studies.allStudies())
    }

    getSelectedRowKeys() {
        //Here is your answer
        console.log(this.refs.table.state.selectedRowKeys)
    }

    render() {
        return (
            <>
                <span class="title">Study</span>

                <BootstrapTable
                    keyField='id'
                    classes="table table-responsive col-sm-8"
                    bodyClasses="du-study-tbody"
                    data={this.getData()}
                    columns={this.columns}
                    selectRow={selectRow} />
            </>
        )
    }
}

const selectRow = {
    mode: 'radio',
    clickToSelect: true
};
