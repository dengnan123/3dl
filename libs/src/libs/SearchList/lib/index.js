import PropTypes from 'prop-types';
import { useState } from 'react';
import { debounce, isObject } from 'lodash';
import { getNameByLang } from '../../../helpers/lang';
import API, { HTTP_METHOD_LIST } from '../../../helpers/api';

import { Input, List, Spin } from 'antd';
import styles from './index.less';

const { Search } = Input;

const _fetchData = async (url = '', method = 'GET', params, callback) => {
  const httpMethod = HTTP_METHOD_LIST.filter(m => m === method)[0].toLocaleLowerCase();

  try {
    const res = await API[httpMethod](url, { params });
    if (isObject(res)) {
      setTimeout(() => {
        callback && callback(res);
      }, 300);
      return;
    }
    callback && callback();
  } catch (err) {
    callback && callback();
  }
};

const fetchData = debounce(_fetchData, 800);

const SearchList = props => {
  const {
    style: {
      fetchUrl = 'https://www.fastmock.site/mock/29adb8c7e763fd69d52f9c23f533f21e/test/search/user',
      httpMethod = 'GET',
      inputHeight = 40,
      inputFontColor = '#424242',
      inputPlaceholder = '请搜索',
      inputPlaceholderEn = 'Please search',
      inputMarginBottom = 40,
      listFontColor = '#424242',
      listTextAligh = 'center',
    },
    lang = 'en-US',
    onChange,
  } = props;

  const [searchValue, setSearchValue] = useState();

  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const [dataSource, setDataSource] = useState([]);

  const fetchCallback = result => {
    setIsLoading(false);
    setIsLoaded(true);
    if (result) {
      setDataSource(result.data);
    }
  };

  const _onChange = e => {
    const value = e.target.value;
    setSearchValue(value);
    setIsLoading(true);
    setDataSource([]);
    fetchData(fetchUrl, httpMethod, { value }, fetchCallback);
  };

  const _onClick = obj => {
    onChange && onChange(obj);
  };

  return (
    <div className={styles.container}>
      <div className={styles.head} style={{ marginBottom: inputMarginBottom }}>
        <Search
          value={searchValue}
          onChange={_onChange}
          allowClear={true}
          placeholder={getNameByLang(lang, inputPlaceholder, inputPlaceholderEn)}
          style={{ height: inputHeight, color: inputFontColor }}
        />
      </div>
      <div className={styles.content}>
        <List
          dataSource={dataSource}
          renderItem={item => (
            <List.Item
              onClick={() => _onClick(item)}
              key={item.id}
              style={{ color: listFontColor, textAlign: listTextAligh }}
            >
              <div>{item.label}</div>
            </List.Item>
          )}
        >
          {isLoading && (
            <div className={styles.loading}>
              <Spin />
            </div>
          )}

          {!isLoading && isLoaded && !dataSource.length && (
            <div className={styles.noData} style={{ color: listFontColor }}>
              No Data
            </div>
          )}
        </List>
      </div>
    </div>
  );
};

SearchList.propTypes = {
  onChange: PropTypes.func,
  style: PropTypes.object,
  lang: PropTypes.string,
};

export default SearchList;
