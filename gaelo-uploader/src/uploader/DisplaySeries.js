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

export default class DisplaySeries extends Component {

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
            text: 'Description',
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

    getData() {
        return Object.values(this.props.series.allStudies())
    }

    render() {
        return (
            <>
                <span class="title">Series</span>
                <div className="row">
                    <div className="col" class="table table-responsive table-borderless col-sm-8">
                        <BootstrapTable
                            keyField='id'
                            classes="table table-responsive col-sm-8"
                            bodyClasses="du-series-tbody"
                            data={this.getData()}
                            columns={this.columns} />
                    </div>
                    <div className="col" class="table table-responsive table-borderless col-sm-4">
                        <BootstrapTable
                            keyField='id'
                            classes="table table-responsive col-sm-4"
                            bodyClasses="du-series-warnings"
                            data={this.getData()}
                            columns={this.warnings} />
                    </div>
                </div>
            </>
        )
    }

}