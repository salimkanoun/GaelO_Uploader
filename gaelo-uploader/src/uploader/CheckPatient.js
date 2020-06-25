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
import BootstrapTable from 'react-bootstrap-table-next';
import ButtonIgnore from './ButtonIgnore'
import Button from 'react-bootstrap/Button'

export default class CheckPatient extends Component {

    constructor(props) {
        super(props)
        this.onClick = this.onClick.bind(this)
    }

    columns = [
        {
            dataField: 'rowName',
            text: '',
        },
        {
            dataField: 'expectedData',
            text: 'Expected',
        },
        {
            dataField: 'currentData',
            text: 'Current',
        },
        {
            dataField: 'ignoreButton',
            text: '',
        },
    ]

    onClick(id, ignored) {

    }

    getData() {
        let studyTemp = this.props.studies.allStudies();
        //let study = studyTemp[String(Object.keys(studyTemp))]
        //console.log("temp" + Object.values(study))
        return Object.entries(this.props.studies.allStudies())
    }

    getPatientFirstName() {
        let data = this.props.studies;
        return (this.data)
    }

    generateRows() {
        let labels = ['First Name', 'Last Name', 'Birth Date', 'Sex', 'Acquisition Date']
        let data = []
        for (let i in labels) {
            data.push({ id: i, rowName: labels[i], expectedData: null, currentData: null, ignoreButton: <ButtonIgnore id={i} onClick={this.onClick} /> })
        }
        return data
    }

    gatheredData() {
        return this.getData();
    }

    render() {
        return (
            <Modal show={this.props.display} onHide={this.props.closeListener} updatedData={null}>
                {this.getPatientFirstName()}
                <Modal.Header class="modal-header" closeButton>
                    <Modal.Title class="modal-title" id="du-patientLongTitle">Check Patient</Modal.Title>
                </Modal.Header>
                <Modal.Body class="modal-body" id="du-patp-comparison">
                    <p>The imported patient informations do not match with the ones in the server. We let you check these informations below:</p>
                    <BootstrapTable
                        keyField='id'
                        classes="table table-responsive table-borderless table-sm"
                        bodyClasses="du-patp-comparison"
                        data={Object.values(this.generateRows())}
                        columns={this.columns} />
                    <p>If you want to force the upload you may have to ignore all the warnings.</p>
                </Modal.Body>
                <Modal.Footer class="modal-footer">
                    <Button id="du-patp-btn-confirm" type="button" class="btn btn-primary" data-dismiss="modal">This is the correct patient</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}