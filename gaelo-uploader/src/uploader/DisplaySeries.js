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

    constructor(props) {
        super(props)
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

    getSeries() {
        let series = this.props.studies.allStudies() 
        let seriesData = []
        for (let e in series[this.props.studyID]) {
            if(e == 'series'){
                series = series[this.props.studyID][e]
                for(let element in series){
                let nbInstances = 0
                for (let instances in series[element].instances){
                    nbInstances++
                }
                seriesData.push({
                    status: null, seriesDescription: series[element].seriesDescription, modality: series[element].modality,
                    accessionNumber: series[element].seriesNumber, acquisitionDate: series[element].seriesDate, instances:nbInstances
                })
            }
            }
        }         
        return seriesData
    }

    render() {
        if (this.props.studies != null) {
            return (
                <>
                    <span class="title">Series</span>
                    <div className="row">
                        <div className="col" class="table table-responsive table-borderless col-sm-8">
                            <BootstrapTable
                                keyField='id'
                                classes="table table-responsive col-sm-8"
                                bodyClasses="du-series-tbody"
                                data={Object.values(this.getSeries())}
                                columns={this.columns} />
                        </div>
                        <div className="col" class="table table-responsive table-borderless col-sm-4">
                            <BootstrapTable
                                keyField='id'
                                classes="table table-responsive col-sm-4"
                                bodyClasses="du-series-warnings"
                                data={Object.values(this.props.studies.allStudies())}
                                columns={this.warnings} />
                        </div>
                    </div>
                </>
            )
        } else { return null }
    }

}