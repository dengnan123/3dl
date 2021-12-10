import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Input } from 'antd';

import styles from './index.less';

function WeatherHeaderFilter(props) {
  const { isInitialized, onAddClick, onSearch } = props;
  const [sValue, setSearchValue] = useState(null);

  useEffect(() => {
    if (isInitialized) {
      setSearchValue(null);
    }
  }, [isInitialized]);

  const onInputChange = ev => {
    const value = ev?.target?.value;
    console.log('Search value===', value);
    setSearchValue(value);
    if (!value) {
      onSearch && onSearch({ keyword: null });
    }
  };

  const onInputSearch = () => {
    if (!sValue) return;
    console.log('Search===');
    onSearch && onSearch({ keyword: sValue });
  };

  return (
    <div className={styles.topContainer}>
      <div className={styles.topLeft}>
        <Input.Search
          placeholder="输入code进行搜索"
          onChange={onInputChange}
          value={sValue}
          onSearch={onInputSearch}
        />
      </div>
      <div className={styles.topBtns}>
        <Button type="primary" onClick={onAddClick}>
          + 添加
        </Button>
      </div>
    </div>
  );
}

WeatherHeaderFilter.propTypes = {
  total: PropTypes.number,
  onAddClick: PropTypes.func,
};

export default WeatherHeaderFilter;
