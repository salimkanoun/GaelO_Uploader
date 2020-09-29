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
import OptionCog from '../images/optionCog'
export default class Options extends Component {

    state = {
        batchUploadSize: 200,
        zipIntensity: 3
    }

    constructor(props){
        super(props)
        this.updateBatchSize = this.updateBatchSize.bind(this)
        this.updateZipIntensity = this.updateZipIntensity.bind(this)
    }

    updateBatchSize = (object, value) => {
        this.setState({
            batchUploadSize : value
        })
        localStorage.setItem('batchUploadSize', value);
    }

    updateZipIntensity = (object, value) => {
        this.setState({
            zipIntensity : value
        })
        localStorage.setItem('zipIntensity', value);
    }

    componentDidMount() {

        if(localStorage.getItem('zipIntensity') !== null){

            let zipIntensity = parseInt(localStorage.getItem('zipIntensity'))
            let batchUploadSize = parseInt(localStorage.getItem('batchUploadSize'))
            this.setState({
                zipIntensity : zipIntensity,
                batchUploadSize : batchUploadSize
            })

        }else{
            localStorage.setItem('zipIntensity', 3)
            localStorage.setItem('batchUploadSize', 200)
        }
        
    }

    render() {
        return (
            <>
                <OverlayTrigger rootClose trigger="click" placement="right" overlay={
                    <Popover className='popover' id="popover-basic">
                        <Popover.Title as="h3">Options</Popover.Title>
                        <Popover.Content>
                            <Typography id="discrete-slider-restrict" gutterBottom>
                                Upload batch size
                            </Typography>
                            <Slider
                                defaultValue={200}
                                value = {this.state.batchUploadSize}
                                aria-labelledby="discrete-slider-restrict"
                                step={null}
                                marks={batchSize}
                                max={500}
                                valueLabelDisplay="auto"
                                valueLabelFormat={(x) => x}
                                onChangeCommitted={this.updateBatchSize}
                            />
                            <Typography id="discrete-slider-restrict" gutterBottom>
                                Zip compressing intensity
                            </Typography>
                            <Slider
                                defaultValue={3}
                                value = {this.state.zipIntensity}
                                aria-labelledby="discrete-slider-restrict"
                                step={1}
                                marks
                                min={1}
                                max={9}
                                valueLabelDisplay="auto"
                                onChangeCommitted={this.updateZipIntensity}
                            />
                        </Popover.Content>
                    </Popover>
                }>
                    <Button variant="secondary" className='optionCog'> 
                        <OptionCog/> 
                    </Button>
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