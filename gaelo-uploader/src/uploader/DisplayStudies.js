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
import Button from 'react-bootstrap/Button'
import CheckPatient from './CheckPatient'

export default class DisplayStudies extends Component {

    constructor(props) {
        super(props);
        this.state = {

            columns: [
                {
                    dataField: 'idP',
                    text: '',
                    formatter: this.linkCheck,
                },
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
                    text: 'Accession #',
                },
                {
                    dataField: 'acquisitionDate',
                    text: 'Date',
                },
            ],
            isCheck: false
        }
        this.onCheckChanged = this.onCheckChanged.bind(this);
    }

    warnings = [
        {
            dataField: 'warnings',
            text: 'Warnings',
        },
    ];

    rowEventsStudies = {
        onClick: (e, row) => {
          this.setState({currentSelectedStudyId: row.patientName})
        }
      }

    onCheckChanged() {
        this.setState({ isCheck: !this.state.isCheck });
        console.log(this.state.isCheck);
    }

    linkCheck = (cell, row, rowIndex, formatExtraData) => {
        return (
            <Button onClick={() => { this.onCheckChanged(row); }}>
                Check Patient
            </Button>
        );
    };

    getData() {
        return Object.values(this.props.studies.allStudies())
    }

    getSelectedRowKeys() {
        //Here is your answer
        console.log(this.refs.table.state.selectedRowKeys)
    }

    render() {
        return (
            <>
            <CheckPatient display={this.state.isCheck} closeListener={this.onCheckChanged} studies={this.props.studies}/>
                <span class="title">Study</span>
                <div className="row">
                    {console.log(this.getData())}
                    <div className="col" class="table table-hover table-responsive table-borderless col-sm-8">
                        <BootstrapTable studyID={this.state.currentSelectedStudyId}
                            keyField='id'
                            classes="table table-responsive col-sm-8"
                            bodyClasses="du-studies-tbody"
                            data={this.getData()}
                            columns={this.state.columns}
                            selectRow={selectRow} />
                    </div>
                    <div className="col" class="table table-hover table-responsive table-borderless col-sm-4">
                        <BootstrapTable
                            keyField='id'
                            classes="table table-responsive col-sm-4"
                            bodyClasses="du-studies-warnings"
                            data={this.getData()}
                            columns={this.warnings} />
                    </div>
                </div>
            </>
        )
    }
}

const selectRow = {
    mode: 'radio',
    clickToSelect: true
};
