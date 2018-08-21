import PropTypes from 'prop-types';
import React from 'react';
import { color } from '@data-ui/theme';

import BaseBrush from '../utils/brush/Brush';
import { generalStyleShape, marginShape } from '../utils/propShapes';

const SAFE_PIXEL = 2;

export const propTypes = {
  selectedBoxStyle: generalStyleShape,
  xScale: PropTypes.func,
  yScale: PropTypes.func,
  innerHeight: PropTypes.number.isRequired,
  innerWidth: PropTypes.number.isRequired,
  onChange: PropTypes.func,
  margin: marginShape,
  brushDirection: PropTypes.oneOf(['vertical, horizontal, both']),
  resizeTriggerAreas: PropTypes.arrayOf([
    'left',
    'right',
    'top',
    'bottom',
    'topLeft',
    'topRight',
    'bottomLeft',
    'bottomRight',
  ]),
  brushRegion: PropTypes.oneOf(['xAxis, yAxis, chart']),
  registerStartEvent: PropTypes.func,
  yAxisOrientation: PropTypes.oneOf(['left', 'right']),
  xAxisOrientation: PropTypes.oneOf(['top', 'bottom']),
};

const defaultProps = {
  xScale: null,
  yScale: null,
  onChange: () => {},
  selectedBoxStyle: {
    fill: color.default,
    fillOpacity: 0.2,
    stroke: color.default,
    strokeWidth: 1,
    strokeOpacity: 0.8,
  },
  margin: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  brushDirection: 'horizontal',
  resizeTriggerAreas: ['left', 'right'],
  brushRegion: 'chart',
  registerStartEvent: null,
  yAxisOrientation: 'right',
  xAxisOrientation: 'bottom',
};

class Brush extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(brush) {
    const { xScale, yScale, onChange } = this.props;
    const { x0, x1, y0, y1 } = brush.extent;
    if (x0 < 0) {
      onChange(null);

      return;
    }
    const invertedX0 = xScale.invert(x0 + (x0 < x1 ? -SAFE_PIXEL : SAFE_PIXEL));
    const invertedX1 = xScale.invert(x1 + (x1 < x0 ? -SAFE_PIXEL : SAFE_PIXEL));
    const invertedY0 = yScale.invert(y0 + (y0 < y1 ? -SAFE_PIXEL : SAFE_PIXEL));
    const invertedY1 = yScale.invert(y1 + (y1 < y0 ? -SAFE_PIXEL : SAFE_PIXEL));
    const domainRange = {
      x0: Math.min(invertedX0, invertedX1),
      x1: Math.max(invertedX0, invertedX1),
      y0: Math.min(invertedY0, invertedY1),
      y1: Math.max(invertedY0, invertedY1),
    };
    onChange(domainRange);
  }

  render() {
    const {
      xScale,
      yScale,
      innerHeight,
      innerWidth,
      margin,
      brushDirection,
      resizeTriggerAreas,
      brushRegion,
      registerStartEvent,
      yAxisOrientation,
      xAxisOrientation,
      selectedBoxStyle,
    } = this.props;
    if (!xScale || !yScale) return null;

    let brushRegionWidth;
    let brushRegionHeight;
    let left;
    let top;

    if (brushRegion === 'chart') {
      left = 0;
      top = 0;
      brushRegionWidth = innerWidth;
      brushRegionHeight = innerHeight;
    } else if (brushRegion === 'yAxis') {
      top = 0;
      brushRegionHeight = innerHeight;
      if (yAxisOrientation === 'right') {
        left = innerWidth;
        brushRegionWidth = margin.right;
      } else {
        left = -margin.left;
        brushRegionWidth = margin.left;
      }
    } else {
      left = 0;
      brushRegionWidth = innerWidth;
      if (xAxisOrientation === 'bottom') {
        top = innerHeight;
        brushRegionHeight = margin.bottom;
      } else {
        top = -margin.top;
        brushRegionHeight = margin.top;
      }
    }

    return (
      <BaseBrush
        width={brushRegionWidth}
        height={brushRegionHeight}
        left={left}
        top={top}
        inheritedMargin={margin}
        onChange={this.handleChange}
        handleSize={4}
        resizeTriggerAreas={resizeTriggerAreas}
        brushDirection={brushDirection}
        registerStartEvent={registerStartEvent}
        selectedBoxStyle={selectedBoxStyle}
      />
    );
  }
}

Brush.propTypes = propTypes;
Brush.defaultProps = defaultProps;
Brush.displayName = 'Brush';

export default Brush;
