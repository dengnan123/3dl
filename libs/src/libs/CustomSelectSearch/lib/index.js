import { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'antd';
import styles from './style.less';

function CustomSelectSearch(props) {
  const [value, setValue] = useState(undefined);
  const [show, setShow] = useState(false);

  const { onChange, style, data, otherCompParams } = props;

  const SearchTimer = useRef();
  const clearTimer = useRef();
  const divDom = useRef();
  const obj = getUrlQueryObj(window.location.href);

  const { width = 380, height = 40, fontSize = 14, placeholder = '请输入关键字' } = style || {};

  const _onSelectChange = data => {
    console.log('_onSelectChange is --》', data);
    setValue(data?.userName || undefined);
    setShow(false);
    onChange &&
      onChange({
        includeEvents: [
          'showComps',
          'hiddenComps',
          'passParams',
          'callback',
          'paramsCache',
          'langChange',
          'fetchApi',
        ],
        formParams: { ...otherCompParams, selectData: data },
      });
  };

  const onSearch = event => {
    const val = `${event.target.value}`.trim();
    setValue(val);
    if (val) {
      setShow(true);
      if (SearchTimer.current) {
        clearTimeout(SearchTimer.current);
      }
      if (clearTimer.current) {
        clearTimeout(clearTimer.current);
      }
      console.log('onSearch is --dd passParams', event.target.value);
      onChange &&
        onChange({
          includeEvents: ['passParams', 'fetchApi'],
          formParams: { ...otherCompParams, searchKey: val },
        });
      clearTimer.current = setTimeout(() => {
        setValue(undefined);
        setShow(false);
      }, 1000 * 65);
    } else {
      setShow(false);
    }
  };

  if (!obj.floor || Number(obj.floor) === 1) {
    return null;
  }

  return (
    <div className={styles.contanier}>
      <Input.Search
        onChange={onSearch}
        value={value}
        placeholder={placeholder}
        style={{ width, height, fontSize: `${fontSize}px` }}
        allowClear
      />

      <div style={{ width }} ref={divDom} className={styles.list}>
        {show && Array.isArray(data) && data.length > 0 && (
          <ul style={{ width, overflow: 'hidden' }}>
            {data.map((item, index) => {
              return (
                <li style={{ width }} key={item.id} onClick={() => _onSelectChange(item)}>
                  <span>{item.userName}</span>
                  <span>{item.groupName}</span>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* <Select
        onChange={_onSelectChange}
        value={value}
        placeholder={placeholder}
        allowClear
        showSearch
        showArrow={false}
        onSearch={onSearch}
        size="large"
        style={{ width, height, fontSize }}
      >
        {Array.isArray(data) &&
          data.map((item, index) => {
            return (
              <Select.Option key={item.id} value={`${item.id}`}>
                {item.name}
              </Select.Option>
            );
          })}
      </Select> */}
    </div>
  );
}

CustomSelectSearch.propTypes = {
  onChange: PropTypes.func,
  style: PropTypes.object,
  data: PropTypes.array,
  lang: PropTypes.string,
  shouldClearParams: PropTypes.bool,
};

export default CustomSelectSearch;

function getUrlQueryObj(url) {
  var theRequest = {};
  if (url.indexOf('?') !== -1) {
    var [...arr] = url.split('?');
    if (Array.isArray(arr)) {
      for (let j = 0; j < arr.length; j++) {
        const str = arr[j];
        const strs = str.split('&');
        for (var i = 0; i < strs.length; i++) {
          theRequest[strs[i].split('=')[0]] =
            String(strs[i].split('=')[1]) === 'undefined' ||
            String(strs[i].split('=')[1]) === 'null'
              ? ''
              : strs[i].split('=')[1];
        }
      }
    }
  }
  return theRequest;
}
