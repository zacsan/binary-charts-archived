import React, { PureComponent } from 'react';
import styles from '../styles';
import IntervalPicker from './IntervalPicker';
import TypePicker from './TypePicker';
import IndicatorsPicker from './IndicatorsPicker';
import SharePicker from './SharePicker';
import CrosshairSwitcher from './CrosshairSwitcher';
import SettingsPicker from './SettingsPicker';

type Props = {
    interval: string,
    type: string,
    compact: boolean,
    crosshair?: boolean,
    chart: HighstockChart,
    hasInterval: boolean,
    pickerShown: string,
    getChart: () => any,
    getXAxis: () => any,
    getYAxis: () => any,
    onShowPicker: (picker: any) => void,
    onIntervalChange: (interval: string) => void,
    onTypeChange: (chartType: string) => void,
};

export default class Toolbar extends PureComponent {

    props: Props;

    static defaultProps = {
        type: 'line',
        compact: false,
        hasInterval: false,
    };

    render() {
        const { compact, getXAxis, getYAxis, getChart, pickerShown,
            onShowPicker, onIntervalChange, onTypeChange } = this.props;

        return (
            <div style={styles.toolbar} className="binary-chart-toolbar">
                <TypePicker
                    expanded={pickerShown === 'type'}
                    onExpand={() => onShowPicker('type')}
                    onChange={onTypeChange}
                />
                {!compact &&
                    <IntervalPicker
                        expanded={pickerShown === 'interval'}
                        onExpand={() => onShowPicker('interval')}
                        onChange={onIntervalChange}
                    />
                }
                <CrosshairSwitcher
                    getXAxis={getXAxis}
                    getYAxis={getYAxis}
                />
                {!compact &&
                    <IndicatorsPicker
                        expanded={pickerShown === 'indicators'}
                        onExpand={() => onShowPicker('indicators')}
                    />
                }
                <SharePicker
                    expanded={pickerShown === 'share'}
                    onExpand={() => onShowPicker('share')}
                    getChart={getChart}
                />
                {!compact && <SettingsPicker />}
            </div>
        );
    }
}