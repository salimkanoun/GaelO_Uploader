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
import ButtonIgnore from './ButtonIgnore'
export default class CheckPatient extends Component {

    columns = [
        {
            dataField: 'rowName',
            text: '',
        },
        {
            dataField: 'expectedStudy',
            text: 'Expected',
        },
        {
            dataField: 'currentStudy',
            text: 'Current',
        },
        {
            dataField: 'ignoreButton',
            text: '',
            formatter: (cell, row, rowIndex, extraData) => ( 
                (row.ignoredStatus !== null) ?
                    <ButtonIgnore row={row} onClick={() => this.props.onClick(row)} dismissed={row.ignoredStatus} />
                    : null
                )
        },
        {
            dataField: 'ignoredStatus',
            text: '',
            hidden: true
        },
    ]

    getRowClasses = (row, rowIndex) => {
        
        if (row.ignoredStatus === false) {
            return 'du-studies row-danger'
        } else if (row.ignoredStatus === null) {
            return 'du-studies row-success'
        }else{
            return 'du-studies td row-info'
        }
        
    }

    render = () => {
        return (
            <>
                <p>
                    The imported patient informations do not match with the ones in the server.<br/> 
                    We let you check these informations below:
                </p> 
                <BootstrapTable
                    keyField='rowName'
                    classes="table table-borderless"
                    bordered={false}
                    bodyClasses="du-studies-tbody"
                    headerClasses="du-studies th"
                    rowClasses={this.getRowClasses}
                    data={this.props.rows}
                    columns={this.columns}
                    selectRow={this.selectRow}
                />
                <p>If you want to force the upload you may have to ignore all the warnings.</p>
            </>
        )
    }

}