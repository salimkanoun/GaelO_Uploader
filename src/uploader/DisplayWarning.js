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
                    warning={this.getWarningStatus(row)}
                    onClick={() => {
                        if (this.props.type === 'series') {
                            this.props.toogleWarningSeries(row, row.seriesInstanceUID)
                            if (this.props.series[row.seriesInstanceUID].status === 'Valid') this.props.removeSeriesReady(row.seriesInstanceUID) 
                            else this.props.addSeriesReady(row.seriesInstanceUID) 
                        } else if (this.props.type === 'study') {
                            //SK ICI A VOIR UNE FOIS DISSOCIEE
                            /*
                            if(row.dismissed) this.props.setNotUsedVisit(row.idVisit)
                            else this.props.setUsedVisit(row.idVisit, this.props.selectedStudy)

                            this.props.updateWarningStudy(row, row.studyInstanceUID)
                            this.props.removeStudyReady(row.studyInstanceUID)
                            */
                        }
                    }}/>
            ),
        },
    ]

    /**
     * Get warning status of selected row 
     * @param {Object} row
     * @return {Boolean}
     */
    getWarningStatus = (row) => {
        if (this.props.type === 'study')
            return this.props.warningsStudies[row.studyInstanceUID][row.key].dismissed
        else if (this.props.type === 'series')
            return this.props.warningsSeries[row.seriesInstanceUID][row.key].dismissed
    }

    /**
     * Build the tab rows according to the type of object
     * @return {Array}
     */
    buildRow = () => {
        if (this.props.selectionID !== undefined && this.props.selectionID !== null) {
            let rows = []
            switch (this.props.type) {
                case 'study':
                    for (let warning of Object.values(this.props.warningsStudies[this.props.selectionID]) ) {
                        rows.push({ 
                            studyInstanceUID: this.props.selectionID, 
                            ...warning
                        })
                    }
                    return rows
                case 'series':
                    for (let warning of Object.values(this.props.warningsSeries[this.props.selectionID])) {
                        rows.push({ 
                            seriesInstanceUID: this.props.selectionID, 
                            ...warning
                        })
                    }
                    return rows
                default:
                    return []
            }
        } else {
            return []
        }
    }

    render = () => {
        return (
            <BootstrapTable
                keyField='key'
                classes="table table-borderless"
                bodyClasses="du-warnings"
                headerClasses="du-warnings th"
                rowClasses={rowClasses}
                wrapperClasses="table-responsive"
                data={this.buildRow()}
                columns={this.columns}
            />
        )
    }
}

const rowClasses = (row, rowIndex) => {
    if (row.dismissed) return 'du-warnings row-ignored'
    else return 'du-warnings td'
}

const mapStateToProps = state => {
    return {
        selectedStudy: state.DisplayTables.selectedStudy,
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