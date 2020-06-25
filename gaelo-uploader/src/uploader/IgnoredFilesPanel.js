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
import Modal from 'react-bootstrap/Modal'
import BootstrapTable from 'react-bootstrap-table-next';

export default class IgnoredFilesPanel extends Component {

    rows = {
    }

    columns = [
        {
            dataField: 'files',
            text: 'Files',
        },
        {
            dataField: 'reasons',
            text: 'Reason',
        },
    ];

    files = []
    reasons = []

    getFiles() {
        return Object.keys(this.props.dataIgnoredFiles)
    }

    getReasons() {
        return Object.values(this.props.dataIgnoredFiles)
    }

    createRows() {
        this.files = this.getFiles()
        this.reasons = this.getReasons()
        for (let i = 0; i < this.files.length; i++) {
            this.rows[this.files[i]] = { files: this.files[i], reasons: this.reasons[i] }
        }
        return this.rows
    }

    render() {
        return (
            <Modal show={this.props.display} onHide={this.props.closeListener}>
                <Modal.Header class="modal-header" closeButton>
                    <Modal.Title class="modal-title">Ignored files <span id="du-ignored-files-badge" class="badge badge-danger">{this.props.fileNumber}</span></Modal.Title>
                </Modal.Header>
                <Modal.Body class="modal-body">
                    <BootstrapTable
                        keyField='id'
                        classes="table table-responsive table-borderless"
                        data={Object.values(this.createRows())}
                        columns={this.columns}
                    />
                </Modal.Body>
            </Modal>
        )
    }
}