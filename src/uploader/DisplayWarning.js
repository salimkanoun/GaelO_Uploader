import React, { Component } from "react";
import BootstrapTable from 'react-bootstrap-table-next'
import { connect } from 'react-redux';
import { toogleWarningSeries, updateWarningStudy } from '../actions/Warnings'
import { removeStudyReady, addSeriesReady, removeSeriesReady } from '../actions/DisplayTables'
import ButtonIgnore from './render_component/ButtonIgnore'

class DisplayWarning extends Component {

    columns = [
        {
            dataField: `${this.props.type}InstanceUID`,
            text: `${this.props.type}InstanceUID`,
            hidden: true,
        },
        {
            dataField: 'key',
            hidden: true,
        },
        {
            dataField: 'content',
            text: 'Warnings',
        },
        {
            dataField: 'dismissed',
            hidden: true
        },
        {
            dataField: 'ignorable',
            hidden: true
        },
        {
            dataField: 'ignoreButton',
            text: '',
            formatter: (cell, row, rowIndex, extraData) => (
                <ButtonIgnore hidden={row.ignorable === false}
                    dismissed={row.dismissed}
                    onClick={() => {
                        if (this.props.type === 'series') {
                            this.props.toogleWarningSeries(row.key, row.seriesInstanceUID)
                        } 
                    }}/>
            ),
        },
    ]
    
    /**
     * Build the tab rows according to the type of object
     * @return {Array}
     */
    buildRow = () => {
        let rows = []
        switch (this.props.type) {
            case 'study':
                if(this.props.selectedStudy ===undefined) return []
                if(this.props.warningsStudies[this.props.selectedStudy] === undefined) return []
                for (let warning of Object.values(this.props.warningsStudies[this.props.selectedStudy]) ) {
                    rows.push({ 
                        studyInstanceUID: this.props.selectedStudy, 
                        ...warning
                    })
                }
                return rows
            case 'series':
                if(this.props.selectedSeries ===undefined) return []
                if (this.props.warningsSeries[this.props.selectedSeries] === undefined) return []
                for (let warning of Object.values(this.props.warningsSeries[this.props.selectedSeries])) {
                    rows.push({ 
                        seriesInstanceUID: this.props.selectedSeries, 
                        ...warning
                    })
                }
                return rows
            default:
                return []
        }

    }

    getRowClasses = (row, rowIndex) => {
        if (row.dismissed) return 'du-warnings row-ignored'
        else return 'du-warnings td'
    }

    render = () => {
        return (
            <BootstrapTable
                keyField='key'
                classes="table table-borderless"
                bodyClasses="du-warnings"
                headerClasses="du-warnings th"
                rowClasses={this.getRowClasses}
                wrapperClasses="table-responsive"
                data={this.buildRow()}
                columns={this.columns}
            />
        )
    }
}



const mapStateToProps = state => {
    return {
        selectedStudy: state.DisplayTables.selectedStudy,
        selectedSeries: state.DisplayTables.selectedSeries,
        series : state.Series.series,
        studiesReady: state.DisplayTables.studiesReady,
        warningsSeries: state.Warnings.warningsSeries,
        warningsStudies: state.WarningsStudy.warningsStudy
    }
}
const mapDispatchToProps = {
    toogleWarningSeries,
    updateWarningStudy,
    removeStudyReady,
    addSeriesReady,
    removeSeriesReady
    
}

export default connect(mapStateToProps, mapDispatchToProps)(DisplayWarning)