import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { Input, Icon } from 'antd';
import _ from 'lodash';

import styles from './index.less';

const CustomizeInput = props => {
  const {
    onChange,
    otherCompParams,
    style: {
      placeholder = '请输入关键字搜索',
      height = 36,
      borderWidth = 1,
      borderColor = '#d9d9d9',
      borderRadius = 0,
      paddingLeft = 11,
      paddingRight = 11,
      bgColor = '#ffffff',
      fontSize = 14,
      fontWeight = 400,
      fontColor = '#d9d9d9',
      isShowIcon = true,
      iconSize = 14,
      iconColor = '#d9d9d9',
      iconRight = 10,
    },
  } = props;

  const [val, setVal] = useState(null);

  /******Input框一些方法===START******/
  const onInputChange = useCallback(event => {
    const { value } = event.target;
    const searchVal = (value || '').trim();
    setVal(searchVal);
  }, []);

  const handleOnFocus = useCallback(() => {}, []);

  const handleOnPressEnter = useCallback(() => {
    // console.log('isSearch=====Start');
    onChange &&
      onChange({
        includeEvents: ['fetchApi'],
        formParams: { ...otherCompParams, searchKey: val },
      });
  }, [onChange, otherCompParams, val]);
  /******Input框一些方法===END******/

  return (
    <div className={styles.container}>
      <div style={{ height }}>
        <Input
          placeholder={placeholder}
          style={{
            height,
            borderWidth,
            borderColor,
            borderRadius,
            paddingLeft,
            paddingRight,
            fontSize,
            fontWeight,
            color: fontColor,
            backgroundColor: bgColor,
          }}
          onChange={onInputChange}
          onFocus={handleOnFocus}
          onPressEnter={_.debounce(handleOnPressEnter, 400)}
        />
        {isShowIcon ? (
          <span
            className={styles.searchIcon}
            onClick={_.debounce(handleOnPressEnter, 400)}
            style={{
              right: iconRight,
              fontSize: iconSize,
              color: iconColor,
            }}
          >
            <Icon type="search" />
          </span>
        ) : null}
      </div>
    </div>
  );
};

CustomizeInput.propTypes = {
  data: PropTypes.object,
  style: PropTypes.object,
};

export default CustomizeInput;
