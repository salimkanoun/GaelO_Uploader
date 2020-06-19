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

export default class StudiesSeries extends Component {



    render() {
        return (
            <Fragment>
                <span class="title">Studies</span>
                <div class="row">
                    <table class="table table-responsive col-sm-8">
                        <thead>
                            <tr>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th>Status</th>
                                <th>Patient name</th>
                                <th>Description</th>
                                <th>Accession #</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody id="du-studies-tbody">
                        </tbody>
                    </table>

                    <table class="table table-responsive col-sm-4">
                        <thead>
                            <tr>
                                <th>Warnings</th>
                            </tr>
                        </thead>
                        <tbody id="du-studies-warnings">
                        </tbody>
                    </table>
                </div>

                <span class="title">Series</span>

                <div class="row">
                    <table class="table table-responsive col-sm-8">
                        <thead>
                            <tr>
                                <th></th>
                                <th>Status</th>
                                <th>Description</th>
                                <th>Modality</th>
                                <th>#</th>
                                <th>Date</th>
                                <th>Nb of Instances</th>
                            </tr>
                        </thead>
                        <tbody id="du-series-tbody">
                        </tbody>
                    </table>

                    <table class="table table-responsive col-sm-4">
                        <thead>
                            <tr>
                                <th>Warnings</th>
                            </tr>
                        </thead>
                        <tbody id="du-series-warnings">
                        </tbody>
                    </table>
                </div>
            </Fragment>
        )
    }
}