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
import IgnoredFilesPanel from './IgnoredFilesPanel'

export default class ParsingDetails extends Component {

    render() {
        return (
            <Fragment>
                <span id="du-loaded-badge" className="badge">
                    <span id="nb-files-loaded">{this.props.fileLoaded} File(s) loaded</span>
                </span>

                <span id="du-parsed-badge" className="badge">
                    <span id="nb-files-parsed">{this.props.fileParsed} File(s) parsed</span>
                </span>

                <span id="du-ignored-badge" className="badge">
        <span id="nb-files-ignored" onClick={this.props.onClick}>{this.props.fileIgnored} File(s) ignored (Click to show)</span>
                </span>

                <IgnoredFilesPanel display={this.props.displayIgnoredFiles} fileNumber={this.props.fileIgnored} 
                closeListener={this.props.closeIgnoredFiles} dataIgnoredFiles={this.props.dataIgnoredFiles}/>


                <span id="du-status-info-text"></span>

                <div id="du-ignored-files-panel"></div>
            </Fragment>
        )
    }
}