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

import React, { Component, useState, setShow } from 'react'
import Modal from 'react-bootstrap/Modal'

export default class IgnoredFilesPanel extends Component {

    render() {
        return (
            <Modal show={this.props.display} onHide={this.props.closeListener}>
                <Modal.Header class="modal-header" closeButton>
                    <Modal.Title class="modal-title">Ignored files <span id="du-ignored-files-badge" class="badge badge-danger">{this.props.fileNumber}</span></Modal.Title>
                </Modal.Header>
                <Modal.Body class="modal-body">
                    <table class="table table-responsive">
                        <thead>
                            <tr>
                                <th>Files</th>
                                <th>Reason</th>
                            </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    </table>
                </Modal.Body>
            </Modal>
        )
    }
}