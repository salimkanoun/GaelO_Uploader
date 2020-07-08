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
import Button from 'react-bootstrap/Button'

export default class ButtonIgnore extends Component {

    state = {
        ignored: false
    }

    constructor(props) {
        super(props)
        this.onClick = this.onClick.bind(this)
    }

    onClick() {
        this.props.onClick()
        this.setState( (prevState) => ( {ignored: !prevState.ignored}))
    }

    render() {
        return (
            <Button onClick={this.onClick}> { this.state.ignored ? 'Consider' : 'Ignore' } </Button>
        )
    }
}