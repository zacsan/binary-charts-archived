import React, { PureComponent } from 'react';
import { getLast } from 'binary-utils';
import styles from '../styles';

const options = [
    { text: '5m', seconds: 5 * 60 },
    { text: '15m', seconds: 15 * 60 },
    { text: '1h', seconds: 60 * 60 },
    { text: '3h', seconds: 3 * 60 * 60 },
    { text: '12h', seconds: 12 * 60 * 60 },
    { text: '1d', seconds: 24 * 60 * 60 },
    { text: '1w', seconds: 7 * 25 * 60 * 60 },
    { text: '30d', seconds: 30 * 25 * 60 * 60 },
];

export default class TimeFramePicker extends PureComponent {

    props: {
        data: Tick[],
        getData?: (start: Epoch, end: Epoch) => void,
        getXAxis: () => any,
        getSeries: () => any,
        showAllTimeFrame: boolean,
    };

    setRange = (fromDistance: seconds) => {
        const series = this.props.getSeries();
        const xAxis = this.props.getXAxis();
        const end = xAxis.max;
        const start = xAxis.max - fromDistance * 1000;

        const firstDataX = series.options.data[0][0];
        const dataDiff = start - firstDataX;

        if (dataDiff < 0) {
            const result = this.props.getData(Math.round(start / 1000), Math.round(firstDataX / 1000));
            if (result.then) {
                result.then((data) => {
                    if (!data || data.length === 0) {
                        xAxis.setExtremes(xAxis.min, end, true, false);
                        return;
                    }

                    const smallestDataInMillis = (data[0].epoch) * 1000;
                    const closestToStart = smallestDataInMillis < start ? start : smallestDataInMillis;
                    xAxis.setExtremes(closestToStart, end, true, false);
                });
            }
        } else {
            xAxis.setExtremes(start, end, true, false);
        }
    };

    setRangeToMax = () => {
        const xAxis = this.props.getXAxis();
        const { dataMin, dataMax } = xAxis.getExtremes();
        xAxis.setExtremes(dataMin, dataMax, true, false);
    }

    render() {
        const { data, showAllTimeFrame } = this.props;

        let opt = options;
        if (!showAllTimeFrame && data.length > 0) {
            const max = getLast(data).epoch;
            const min = data[0].epoch;
            opt = options.filter(o => o.seconds <= max - min);
        }

        return (
            <div style={styles.timeFramePicker} className="binary-chart-time-frame-picker">
                {opt.map(x =>
                    <button
                        key={x.text}
                        style={styles.timeFrameButton}
                        onClick={() => this.setRange(x.seconds)}
                    >
                        {x.text}
                    </button>
                )}
                <button style={styles.timeFrameButton} onClick={this.setRangeToMax}>Max</button>
            </div>
        );
    }
}