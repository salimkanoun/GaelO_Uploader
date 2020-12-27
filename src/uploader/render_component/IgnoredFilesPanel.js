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
import { Modal, Badge } from 'react-bootstrap'
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';

export default class IgnoredFilesPanel extends Component {

    columns = [
        {
            dataFiled : 'key',
            hidden : true
        },
        {
            dataField: 'file',
            text: 'Files',
        },
        {
            dataField: 'reason',
            text: 'Reasons',
        },
    ];

    /**
     * Create rows for table display
     */
    createRows = () => {
        let ignoredFileNames = Object.keys(this.props.dataIgnoredFiles)
        let rows = []
        ignoredFileNames.forEach(ignoredFileName => {
            rows.push( { 
                key : Math.random(), 
                file: ignoredFileName, 
                reason: this.props.dataIgnoredFiles[ignoredFileName],
            })            
        })
        return rows
    }

    render = () => {
        return (
            <Modal show={this.props.display} onHide={this.props.closeListener}>
                <Modal.Header className="modal-header" closeButton>
                    <Modal.Title className="modal-title"> 
                        <Badge variant='warning'> {Object.keys(this.props.dataIgnoredFiles).length} File(s) Ignored</Badge>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="modal-body">
                    <BootstrapTable
                        keyField='key'
                        bodyClasses="du-ignored-files-modal td"
                        headerClasses="du-ignored-files-modal th"
                        classes="table table-responsive table-borderless"
                        data={ this.createRows() }
                        pagination={ paginationFactory() }
                        columns={this.columns}
                    />
                </Modal.Body>
            </Modal>
        )
    }
}