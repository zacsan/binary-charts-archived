import React, { PureComponent } from 'react';
import Add from 'react-material-design-icons/icons/Add';
import Remove from 'react-material-design-icons/icons/Remove';
import ChevronLeft from 'react-material-design-icons/icons/ChevronLeft';
import ChevronRight from 'react-material-design-icons/icons/ChevronRight';
import LastPage from 'react-material-design-icons/icons/LastPage';
import Refresh from 'react-material-design-icons/icons/Refresh';
import styles from '../styles';

export default class ZoomControls extends PureComponent {

    props: {
        getData?: (start: Epoch, end: Epoch) => void,
        getXAxis: () => any,
        getSeries: () => any,
    };

    moveOffset = (direction: number): void => {
        const getData = this.props.getData;
        const xAxis = this.props.getXAxis();
        const { min, max, dataMin, dataMax } = xAxis;
        const step = (max - min) / 10 * direction;

        const newMin = min + step;

        const start = Math.max(dataMin, newMin);
        const end = Math.min(dataMax, max + step);

        xAxis.setExtremes(start, end, true);

        if (newMin < dataMin) {
            const startEpoch = Math.round(newMin / 1000);
            const endEpoch = Math.round(dataMin / 1000);
            getData(startEpoch, endEpoch).then((data) => {
                if (!data || data.length === 0) {
                    xAxis.setExtremes(min, end, true);
                }

                const smallestDataInMillis = (data[0].epoch) * 1000;
                const closestToStart = smallestDataInMillis < newMin ? newMin : smallestDataInMillis;
                xAxis.setExtremes(closestToStart, end, true);
            });
        }
    }

    moveLeft = () => this.moveOffset(-1);

    moveRight = () => this.moveOffset(1);

    // decrease visible data by half
    zoomIn = () => {
        const xAxis = this.props.getXAxis();
        const { min, max } = xAxis;
        const halfDiff = (max - min) / 2;

        xAxis.setExtremes(min + halfDiff, max, true);
    }

    reset = () => {
        const xAxis = this.props.getXAxis();
        xAxis.setExtremes(xAxis.dataMin, xAxis.dataMax, true);
    }

    // increase visible data to it's double
    zoomOut = () => {
        const xAxis = this.props.getXAxis();
        const { dataMin, min, max } = xAxis;
        const diff = max - min;
        const newMin = Math.max(dataMin, min - diff);
        xAxis.setExtremes(newMin, max, true);
    }

    moveToEnd = () => {
        const xAxis = this.props.getXAxis();
        const { dataMax, min, max } = xAxis;
        const diff = max - min;
        xAxis.setExtremes(dataMax - diff, dataMax, true);
    }

    render() {
        return (
            <span style={styles.zoomControls} className="binary-chart-zoom-controls">
                <div style={styles.zoomSpacer} />
                <a style={styles.zoomButton} className="binary-chart-zoom-button" onClick={this.moveLeft}>
                    <ChevronLeft />
                </a>
                <a style={styles.zoomButton} className="binary-chart-zoom-button" onClick={this.zoomOut}>
                    <Remove />
                </a>
                <a style={styles.zoomButton} className="binary-chart-zoom-button" onClick={this.reset}>
                    <Refresh />
                </a>
                <a style={styles.zoomButton} className="binary-chart-zoom-button" onClick={this.zoomIn}>
                    <Add />
                </a>
                <a style={styles.zoomButton} className="binary-chart-zoom-button" onClick={this.moveRight}>
                    <ChevronRight />
                </a>
                <div style={styles.zoomSpacer}>
                    <a style={styles.zoomButton} className="binary-chart-zoom-button" onClick={this.moveToEnd}>
                        <LastPage />
                    </a>
                </div>
            </span>
        );
    }
}