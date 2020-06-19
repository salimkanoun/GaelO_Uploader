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
import Modal from 'react-bootstrap/Modal'

export default class CheckPatient extends Component {



    render() {
        return (
            <Fragment>
                <div class="modal-dialog modal-dialog-centered" role="document">
                    <div class="modal-content">
                        <Modal.Header class="modal-header">
                            <h5 class="modal-title" id="du-patientLongTitle">Check Patient</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </Modal.Header>
                        <Modal.Body class="modal-body">
                            <div id="du-patp-comparison">
                                <p>The imported patient informations do not match with the ones in the server. We let you check these informations below:</p>
                                <table class="table table-sm">
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>Expected</th>
                                            <th>Current</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr id="${µ(this.fields.fname.idRow)}">
                                            <th>First name</th>
                                            <td id="${µ(this.fields.fname.idExpected)}"></td>
                                            <td id="${µ(this.fields.fname.idCurrent)}"></td>
                                            <td><button id="${µ(this.fields.fname.idBtn)}">Ignore</button></td>
                                        </tr>
                                        <tr id="${µ(this.fields.lname.idRow)}">
                                            <th>Last name</th>
                                            <td id="${µ(this.fields.lname.idExpected)}"></td>
                                            <td id="${µ(this.fields.lname.idCurrent)}"></td>
                                            <td><button id="${µ(this.fields.lname.idBtn)}">Ignore</button></td>
                                        </tr>
                                        <tr id="${µ(this.fields.birthd.idRow)}">
                                            <th>Birth date</th>
                                            <td id="${µ(this.fields.birthd.idExpected)}"></td>
                                            <td id="${µ(this.fields.birthd.idCurrent)}"></td>
                                            <td><button id="${µ(this.fields.birthd.idBtn)}">Ignore</button></td>
                                        </tr>
                                        <tr id="${µ(this.fields.sex.idRow)}">
                                            <th>Sex</th>
                                            <td id="${µ(this.fields.sex.idExpected)}"></td>
                                            <td id="${µ(this.fields.sex.idCurrent)}"></td>
                                            <td><button id="${µ(this.fields.sex.idBtn)}">Ignore</button></td>
                                        </tr>
                                        <tr id="${µ(this.fields.acqd.idRow)}">
                                            <th>Acquisition date</th>
                                            <td id="${µ(this.fields.acqd.idExpected)}"></td>
                                            <td id="${µ(this.fields.acqd.idCurrent)}"></td>
                                            <td><button id="${µ(this.fields.acqd.idBtn)}">Ignore</button></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <p>If you want to force the upload you may have to ignore all the warnings.</p>
                        </Modal.Body>
                        <Modal.Footer class="modal-footer">
                            <button id="du-patp-btn-cancel" type="button" class="btn btn-secondary mr-3" data-dismiss="modal">Cancel</button>
                            <button id="du-patp-btn-confirm" type="button" class="btn btn-primary" data-dismiss="modal">This is the correct patient</button>
                        </Modal.Footer>
                    </div>
                </div>
            </Fragment>
        )
    }
}