import PropTypes from 'prop-types';
import { reap } from '../../../components/SafeReaper';
import classnames from 'classnames';
import { Tooltip } from 'antd';

import styles from './index.less';

const initColors = [
  '#c23531',
  '#2f4554',
  '#61a0a8',
  '#d48265',
  '#91c7ae',
  '#749f83',
  '#ca8622',
  '#bda29a',
  '#6e7074',
  '#546570',
  '#c4ccd3',
];

const CustomizeLegend = props => {
  const { style, data } = props;

  const {
    type = 'horizontal',
    legendWidth = '45%',
    legendHeight = 30,
    legendSpacing = 20,
    fontSize = 12,
    fontColor = '#6C7293',
    valueFontSize,
    valueFontColor,
    fontWeight = 400,
    showIcon = true,
    iconWidth = 9,
    iconHeight = 9,
    iconRadius = 9,
    iconMarginRight = 4,
    hideScrollBar = false,
    hideLastPadding = false,
  } = style || {};

  // 主题颜色
  const colors = reap(style, 'color', []).concat(initColors);
  const categories = reap(data, 'categories', []);
  const dataColor = reap(data, 'color', colors);

  const renderIconContent = iconColor => {
    if (!showIcon) return;
    return (
      <div
        style={{
          width: iconWidth,
          height: iconHeight,
          marginRight: iconMarginRight,
          borderRadius: iconRadius,
          backgroundColor: iconColor,
        }}
      />
    );
  };

  const labelStyles = {
    color: fontColor,
    fontSize: `${fontSize}px`,
    fontWeight: fontWeight,
    width: showIcon ? `calc(100% - ${iconWidth + iconMarginRight}px)` : '100%',
  };

  const valueStyles = {
    color: valueFontColor ? valueFontColor : fontColor,
    fontSize: valueFontSize ? valueFontSize : `${fontSize}px`,
  };

  const hContent = (value, currentLabel, iconColor) => {
    return (
      <>
        <div
          className={styles.left}
          style={{
            width: `calc(100% - ${Math.round(((value.length * fontSize) / 3) * 2) + 6}px)`,
          }}
        >
          {renderIconContent(iconColor)}
          <div
            style={{
              ...labelStyles,
              lineHeight: `${legendHeight}px`,
              height: '100%',
            }}
          >
            {currentLabel}
          </div>
        </div>
        <div
          className={styles.right}
          style={{
            ...valueStyles,
            lineHeight: `${legendHeight}px`,
          }}
        >
          <Tooltip title={value} autoAdjustOverflow={true} trigger="hover">
            {value}
          </Tooltip>
        </div>
      </>
    );
  };

  const vContent = (value, currentLabel, iconColor) => {
    return (
      <>
        <div className={styles.content}>
          {renderIconContent(iconColor)}
          <div
            style={{
              ...labelStyles,
            }}
          >
            {currentLabel}
          </div>
        </div>
        <div
          className={styles.value}
          style={{
            ...valueStyles,
            width: showIcon ? `calc(100% - ${Math.round(iconHeight + iconMarginRight)}px)` : '100%',
            paddingLeft: Math.round(iconHeight + iconMarginRight),
          }}
        >
          <Tooltip title={value} autoAdjustOverflow={true} trigger="hover">
            {value}
          </Tooltip>
        </div>
      </>
    );
  };

  return (
    <div className={classnames(styles.legend, { [styles.hideScrollBar]: hideScrollBar })}>
      {categories.map((label, index) => {
        const iconColor = dataColor[index % dataColor.length];
        const value = reap(data, `dataSource[${index}]`, '');
        const initLabel = label.toString();
        const currentLabel = (
          <Tooltip title={initLabel} autoAdjustOverflow={true} trigger="hover">
            {initLabel}
          </Tooltip>
        );

        let paddingRight = legendSpacing;
        const isLastItem = index === categories.length - 1;
        if (isLastItem && hideLastPadding) {
          paddingRight = 0;
        }

        return (
          <div
            key={index}
            className={classnames(styles.item, { [styles.vertical]: type === 'vertical' })}
            style={{ width: legendWidth, height: legendHeight, paddingRight: paddingRight }}
          >
            {type === 'vertical'
              ? vContent(value, currentLabel, iconColor)
              : hContent(value, currentLabel, iconColor)}
          </div>
        );
      })}
    </div>
  );
};

CustomizeLegend.propTypes = {
  style: PropTypes.object,
  data: PropTypes.object,
};

export default CustomizeLegend;
