import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './index.less';
import { Icon } from 'antd';
import { homeStyleEmnu } from '../styles';
import Svg from '../../../components/Svg/indx';

function HomeLib(props) {
  const {
    style: {
      Unfold = homeStyleEmnu['Unfold'],
      showMenuBtn = homeStyleEmnu['showMenuBtn'],
      box = homeStyleEmnu['box'],
      direction = homeStyleEmnu['direction'],
      iconSize = homeStyleEmnu['iconSize'],
      backgroundColor = homeStyleEmnu['backgroundColor'],
      borderRadius = homeStyleEmnu['borderRadius'],
      buttonGroup = homeStyleEmnu['svgGroup'],
    },
    onChange,
  } = props;

  const { boxWidth, boxHeight } = box;

  const [showMenu, setShowMenu] = useState(Unfold);

  const handleShowMenu = () => {
    setShowMenu(!showMenu);
  };

  const position = { 1: 'block', 2: 'block', 3: 'flex', 4: 'flex' };
  // const [activeKey, setActiveKey] = useState(0);
  const _handleClick = (current, activeIndex) => {
    console.log('_handleClick -> a, b', current, activeIndex);
    const { compKey, compValue } = current;
    // setActiveKey(activeIndex);
    onChange && onChange({ [compKey]: compValue });
  };

  return (
    <div style={{ display: position[direction] }}>
      {(direction === 1 || direction === 3) && (
        <>
          {showMenu && (
            <div
              style={{
                display: position[direction],
              }}
            >
              {buttonGroup.map((item, index) => {
                const svg = buttonGroup[index] && buttonGroup[index];
                return (
                  <div
                    key={index}
                    onClick={() => _handleClick(item, index)}
                    style={{
                      width: boxWidth || 30,
                      height: boxHeight || 30,
                      margin: 5,
                      lineHeight: boxHeight + 'px',
                      fontSize: iconSize,
                      boxShadow: '0px 6px 10px 0px #00000045',
                      backgroundColor: backgroundColor,
                      borderRadius: borderRadius,
                    }}
                    className={styles.menuCol}
                  >
                    {svg ? <Svg svgStr={svg.svgStr} /> : <Icon type="home" />}
                  </div>
                );
              })}
            </div>
          )}

          {showMenuBtn && (
            <div
              style={{
                width: boxWidth || 30,
                height: boxHeight || 30,
                margin: 5,
                lineHeight: boxHeight + 'px',
                fontSize: iconSize,
              }}
            >
              <Icon type="menu" onClick={handleShowMenu} />
            </div>
          )}
        </>
      )}

      {(direction === 2 || direction === 4) && (
        <>
          {showMenuBtn && (
            <div
              style={{
                width: boxWidth || 30,
                height: boxHeight || 30,
                margin: 5,
                lineHeight: boxHeight + 'px',
                fontSize: iconSize,
              }}
            >
              <Icon type="menu" onClick={handleShowMenu} />
            </div>
          )}
          {showMenu && (
            <div
              style={{
                display: position[direction],
              }}
            >
              {buttonGroup.map((item, index) => {
                const svg = buttonGroup[index] && buttonGroup[index];

                return (
                  <div
                    key={index}
                    onClick={() => _handleClick(item, index)}
                    style={{
                      width: boxWidth || 30,
                      height: boxHeight || 30,
                      margin: 5,
                      lineHeight: boxHeight + 'px',
                      fontSize: iconSize,
                      boxShadow: '0px 6px 10px 0px #00000045',
                      backgroundColor: backgroundColor,
                      borderRadius: borderRadius,
                      padding: 5,
                    }}
                    className={styles.menuCol}
                  >
                    {svg ? <Svg svgStr={svg.svgStr} /> : <Icon type="home" />}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}

HomeLib.propTypes = {
  data: PropTypes.object,
  lang: PropTypes.string,
  style: PropTypes.object,
  showDays: PropTypes.number,
};

export default HomeLib;
