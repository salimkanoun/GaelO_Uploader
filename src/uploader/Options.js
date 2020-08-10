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
import { Popover, OverlayTrigger, Button } from 'react-bootstrap'
import { Slider, Typography } from '@material-ui/core';

export default class Options extends Component {

    state = {
        batchUploadSize: 200,
        zipIntensity: 3
    }

    handleValueChange = () => {
        const { batchUploadSize, zipIntensity } = this.state;
        localStorage.setItem('batchUploadSize', batchUploadSize);
        localStorage.setItem('zipIntensity', zipIntensity);
    };

    componentDidMount() {
        const { batchUploadSize, zipIntensity } = this.state;
        localStorage.setItem('batchUploadSize', batchUploadSize);
        localStorage.setItem('zipIntensity', zipIntensity);
    }

    render() {
        return (
            <>
                <OverlayTrigger trigger="click" placement="right" overlay={
                    <Popover className='popover' id="popover-basic">
                        <Popover.Title as="h3">Options</Popover.Title>
                        <Popover.Content>
                            <Typography id="discrete-slider-restrict" gutterBottom>
                                Upload batch size
                            </Typography>
                            <Slider
                                defaultValue={200}
                                aria-labelledby="discrete-slider-restrict"
                                step={null}
                                marks={batchSize}
                                max={500}
                                valueLabelDisplay="auto"
                                valueLabelFormat={(x) => x}
                                onChangeCommitted={(object, value) => {this.setState({ batchUploadSize: value }, this.handleValueChange())}}
                            />
                            <Typography id="discrete-slider-restrict" gutterBottom>
                                Zip compressing intensity
                            </Typography>
                            <Slider
                                defaultValue={3}
                                aria-labelledby="discrete-slider-restrict"
                                step={1}
                                marks
                                min={1}
                                max={9}
                                valueLabelDisplay="auto"
                                onChangeCommitted={(object, value) => {this.setState({ zipIntensity: value }, this.handleValueChange())}}
                            />
                        </Popover.Content>
                    </Popover>
                }>
                    <Button variant="secondary" className='optionCog'><svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-gear" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" d="M8.837 1.626c-.246-.835-1.428-.835-1.674 0l-.094.319A1.873 1.873 0 0 1 4.377 3.06l-.292-.16c-.764-.415-1.6.42-1.184 1.185l.159.292a1.873 1.873 0 0 1-1.115 2.692l-.319.094c-.835.246-.835 1.428 0 1.674l.319.094a1.873 1.873 0 0 1 1.115 2.693l-.16.291c-.415.764.42 1.6 1.185 1.184l.292-.159a1.873 1.873 0 0 1 2.692 1.116l.094.318c.246.835 1.428.835 1.674 0l.094-.319a1.873 1.873 0 0 1 2.693-1.115l.291.16c.764.415 1.6-.42 1.184-1.185l-.159-.291a1.873 1.873 0 0 1 1.116-2.693l.318-.094c.835-.246.835-1.428 0-1.674l-.319-.094a1.873 1.873 0 0 1-1.115-2.692l.16-.292c.415-.764-.42-1.6-1.185-1.184l-.291.159A1.873 1.873 0 0 1 8.93 1.945l-.094-.319zm-2.633-.283c.527-1.79 3.065-1.79 3.592 0l.094.319a.873.873 0 0 0 1.255.52l.292-.16c1.64-.892 3.434.901 2.54 2.541l-.159.292a.873.873 0 0 0 .52 1.255l.319.094c1.79.527 1.79 3.065 0 3.592l-.319.094a.873.873 0 0 0-.52 1.255l.16.292c.893 1.64-.902 3.434-2.541 2.54l-.292-.159a.873.873 0 0 0-1.255.52l-.094.319c-.527 1.79-3.065 1.79-3.592 0l-.094-.319a.873.873 0 0 0-1.255-.52l-.292.16c-1.64.893-3.433-.902-2.54-2.541l.159-.292a.873.873 0 0 0-.52-1.255l-.319-.094c-1.79-.527-1.79-3.065 0-3.592l.319-.094a.873.873 0 0 0 .52-1.255l-.16-.292c-.892-1.64.902-3.433 2.541-2.54l.292.159a.873.873 0 0 0 1.255-.52l.094-.319z" />
                        <path fill-rule="evenodd" d="M8 5.754a2.246 2.246 0 1 0 0 4.492 2.246 2.246 0 0 0 0-4.492zM4.754 8a3.246 3.246 0 1 1 6.492 0 3.246 3.246 0 0 1-6.492 0z" />
                    </svg></Button>
                </OverlayTrigger>
            </>
        )
    }
}

const batchSize = [
    {
        value: 50,
        label: '',
    },
    {
        value: 100,
        label: '100Mo',
    },
    {
        value: 200,
        label: '',
    },
    {
        value: 500,
        label: '500Mo',
    },
];