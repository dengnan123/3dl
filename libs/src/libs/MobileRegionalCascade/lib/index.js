import { useState, useEffect, useCallback, useMemo } from 'react';
import ReactDom from 'react-dom';
import PropTypes from 'prop-types';
import querystring from 'query-string';
import classnames from 'classnames';
import { reap } from '../../../components/SafeReaper';
import API from '../../../helpers/api';

import { Button } from 'antd';
import ArrowSvg from '../../../assets/svg/fam_select_arrow.svg';
import ArrowActiveSvg from '../../../assets/svg/fam_select_arrow_up.svg';

import styles from './index.less';

const API_HOST = window.DP_ENV !== 'release' ? 'https://3dl.dfocus.top/api' : 'API_HOST_PROD';

const proxyUrl = `${API_HOST}/page-comp/apiProxy`;

const getData = (url, { condition, cusHeaders, dataApiUrl, methodType }) => {
  return API.post(proxyUrl, {
    condition,
    cusHeaders,
    dataApiUrl,
    methodType,
  });
};

const provinceKey = 'province';
const cityKey = 'city';
const districtKey = 'district';

const nextLevelObj = {
  [provinceKey]: { level: 2, key: cityKey },
  [cityKey]: { level: 3, key: districtKey },
};

const menuList = [
  {
    key: provinceKey,
    placeholder: '选择省份',
  },
  {
    key: cityKey,
    placeholder: '选择城市',
  },
  {
    key: districtKey,
    placeholder: '选择行政区',
  },
];

// 请求头参数
const headers = { 'DF-Account-ID': 1, 'df-project-id': 1, 'df-tenant-id': 1 };

const MobileRegionalCascade = props => {
  const { onChange, shouldClearParams, width, left = 0, style } = props;

  const [urlParams] = useState(querystring.parse(decodeURI(window.location.search)));

  // 上一次的状态值，用于点击非确定按钮后恢复初始值
  const [initLevelsData, setInitLevelsData] = useState({
    [provinceKey]: [],
    [cityKey]: [],
    [districtKey]: [],
  });

  const [initLevels, setInitLevels] = useState({
    [provinceKey]: {},
    [cityKey]: {},
    [districtKey]: {},
  });

  const [levelsData, setLevelsData] = useState(initLevelsData);
  // 下拉选择后的值
  const [levels, setLevels] = useState(initLevels);
  // loading状态
  const [loadings, setLoadings] = useState({
    [provinceKey]: false,
    [cityKey]: false,
    [districtKey]: false,
  });

  const [dropMenuOpen, setDropMenuOpen] = useState(false);
  // 存储所有数据的大对象
  // const [totalData, setTotalData] = useState({});
  const [dropDownId] = useState(`drop_${new Date().getTime()}`);
  const {
    compKey,
    domId = '',
    paddingTop = 0,
    apiHostEnvKey = 'API_HOST_COMP_PLACEHOLDER__',
    apiHost = 'https://www.fastmock.site/mock/29adb8c7e763fd69d52f9c23f533f21e/test',
    apiPath = '/list',
  } = style || {};

  // 请求url
  const apiUrl = useMemo(() => {
    const api_host = window.DP_ENV !== 'release' ? apiHost : apiHostEnvKey;
    const api = api_host + apiPath;
    return api;
  }, [apiHost, apiHostEnvKey, apiPath]);

  const listener = useCallback(
    e => {
      if (!dropMenuOpen) {
        return;
      }

      let clickInSide = false;
      let noAction = false;
      const findParent = n => {
        if (n.id === dropDownId) {
          clickInSide = true;
          return;
        }
        if ([provinceKey, cityKey, districtKey].includes(n.id)) {
          noAction = true;
          return;
        }
        if (!n.parentNode) {
          return;
        }
        findParent(n.parentNode);
      };
      findParent(e.target);
      if (noAction) {
        return;
      }
      if (!clickInSide) {
        setLevels(initLevels);
        setLevelsData(initLevelsData);
        setDropMenuOpen(false);
        onChange && onChange({ includeEvents: ['showComps'] });
      }
    },
    [dropDownId, dropMenuOpen, initLevels, initLevelsData, onChange],
  );

  useEffect(() => {
    document.body.addEventListener('click', listener);

    return () => document.body.removeEventListener('click', listener);
  }, [listener]);

  // 初始化数据
  useEffect(() => {
    // loading状态
    const newLoadings = { [provinceKey]: false, [cityKey]: false, [districtKey]: false };

    const newLevelsData = { [provinceKey]: [], [cityKey]: [], [districtKey]: [] };

    const _levels = { [provinceKey]: {}, [cityKey]: {}, [districtKey]: {} };

    const fetchData = async (key, defaultValue, apiParams) => {
      // 当前选中项信息
      let currentItem = {};
      const idKey = 'id';

      // api请求结果
      let res = null;

      _levels[key] = {};

      // 拉取数据开始
      newLoadings[key] = true;
      setLoadings(newLoadings);

      res = await getData(proxyUrl, {
        condition: apiParams,
        cusHeaders: headers,
        dataApiUrl: apiUrl,
        methodType: 'GET',
      });

      newLoadings[key] = false;

      // 处理数据
      const data = reap(res, 'data', []);
      const resultList = data;
      currentItem =
        resultList.find(item => defaultValue && `${item[idKey]}` === defaultValue) || {};
      newLevelsData[key] = [...resultList];
      _levels[key] = { ...currentItem };
      setLoadings(newLoadings);
      return { current: { ...currentItem } };
    };

    const fetchList = async () => {
      // 获取省份列表
      const {
        current: { id: currentProvinceId },
      } = await fetchData(provinceKey, urlParams['provinceId'], { level: 1, parentId: 0 });

      // 获取城市列表
      const {
        current: { id: cityId },
      } = await fetchData(cityKey, urlParams['cityId'], {
        level: 2,
        parentId: currentProvinceId,
      });

      // 获取区列表
      await fetchData(districtKey, urlParams['districtId'], { level: 3, parentId: cityId });

      setLevels(_levels);
      setLevelsData(newLevelsData);
      setInitLevels(_levels);
      setInitLevelsData(newLevelsData);
      onChange &&
        onChange({
          [compKey]: { ..._levels },
          isInit: true,
          includeEvents: ['passParams', 'paramsCache', 'fetchApi'],
        });
    };

    if (!apiUrl) {
      return;
    }

    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiUrl]);

  // 判断是否需要重置
  useEffect(() => {
    if (shouldClearParams) {
      setLevels({
        [provinceKey]: {},
        [cityKey]: {},
        [districtKey]: {},
      });
      setLevelsData(v => ({ ...v, [cityKey]: {}, [districtKey]: {} }));
      setInitLevels({
        [provinceKey]: {},
        [cityKey]: {},
        [districtKey]: {},
      });
      setInitLevelsData(v => ({ ...v, [cityKey]: {}, [districtKey]: {} }));
    }
  }, [shouldClearParams]);

  const onSelectChange = useCallback(
    async (value, key) => {
      const { id } = value;
      const { level, key: nextKey } = nextLevelObj[key] || {};

      const newLoadings = { ...loadings };
      const newLevelsData = { ...levelsData };
      const newLevels = { ...levels };
      // 清空子集的数据
      if (key === provinceKey) {
        newLevels[districtKey] = {};
        newLevelsData[districtKey] = [];
        newLevels[cityKey] = {};
        newLevelsData[cityKey] = [];
      }

      if (key === cityKey) {
        newLevels[districtKey] = {};
        newLevelsData[districtKey] = [];
      }

      if (id === 'all') {
        newLevels[key] = {};
        setLevels(newLevels);
        setLevelsData(newLevelsData);
        return;
      }

      newLevels[key] = { ...value };

      // 存在值，说明不是最后一级
      if (level) {
        newLoadings[nextKey] = true;
        newLevelsData[nextKey] = [];
        setLevelsData(newLevelsData);
        setLoadings(newLoadings);
        const res = await getData(proxyUrl, {
          condition: { level, parentId: id },
          cusHeaders: headers,
          dataApiUrl: apiUrl,
          methodType: 'GET',
        });

        const data = reap(res, 'data', []);
        newLevelsData[nextKey] = [...data];
        newLoadings[nextKey] = false;
        setLoadings(newLoadings);
      }
      setLevels(newLevels);
      setLevelsData(newLevelsData);
    },
    [loadings, levelsData, levels, apiUrl],
  );

  const renderSelectList = useCallback(
    (dataSource, key) => {
      return dataSource.map(n => {
        const { id, name } = n;
        const active =
          (levels[key] && levels[key].name === name) || (!levels[key].name && id === 'all');
        return (
          <div
            key={id}
            className={classnames(styles.selectItem, { [styles.active]: active })}
            onClick={active ? null : () => onSelectChange(n, key)}
          >
            {name}
          </div>
        );
      });
    },
    [onSelectChange, levels],
  );

  const handleDropMenuOpen = useCallback(() => {
    if (!dropMenuOpen) {
      setInitLevels(levels);
      setInitLevelsData(levelsData);
      onChange && onChange({ includeEvents: ['hiddenComps'] });
    } else {
      // 当前展开状态，点击后需要恢复上次选中的值
      setLevels(initLevels);
      setLevelsData(initLevelsData);
      onChange && onChange({ includeEvents: ['showComps'] });
    }
    setDropMenuOpen(!dropMenuOpen);
  }, [dropMenuOpen, initLevels, initLevelsData, levels, levelsData, onChange]);

  const handleSubmit = useCallback(() => {
    onChange &&
      onChange({
        [compKey]: levels,
        includeEvents: ['showComps', 'paramsCache', 'passParams', 'fetchApi'],
      });
    setInitLevels(levels);
    setInitLevelsData(levelsData);
    setDropMenuOpen(false);
  }, [compKey, levelsData, levels, onChange]);

  return (
    <>
      <div className={styles.container}>
        <ul className={styles.head}>
          {menuList.map(n => {
            const { key, placeholder } = n;
            const { name, id } = levels[key];
            const label = id === 'all' ? placeholder : name || placeholder;

            return (
              <li key={key} id={key}>
                <span
                  style={{
                    color: dropMenuOpen || (name && id !== 'all') ? '#065bfb' : '#999999',
                  }}
                  onClick={handleDropMenuOpen}
                >
                  {label}
                </span>
                <img
                  src={!dropMenuOpen ? ArrowSvg : ArrowActiveSvg}
                  alt=""
                  style={{
                    transform: `rotate(${!dropMenuOpen ? 0 : 180}deg)`,
                  }}
                />
              </li>
            );
          })}
        </ul>

        {ReactDom.createPortal(
          <div style={{ position: 'absolute', left: 0, top: 0, width: '100%' }}>
            <div
              className={classnames(styles.dropDown, { [styles.dropDownActive]: dropMenuOpen })}
              id={dropDownId}
              style={{ paddingTop, paddingLeft: left }}
            >
              {dropMenuOpen && (
                <>
                  <ul className={styles.head} style={{ width }}>
                    <li>
                      {renderSelectList(
                        !!levelsData[provinceKey].length
                          ? [{ name: '全国', id: 'all' }, ...levelsData[provinceKey]]
                          : [],
                        provinceKey,
                      )}
                    </li>
                    <li>
                      {renderSelectList(
                        !!levelsData[cityKey].length
                          ? [{ name: '不限', id: 'all' }, ...levelsData[cityKey]]
                          : [],
                        cityKey,
                      )}
                    </li>
                    <li>
                      {renderSelectList(
                        !!levelsData[districtKey].length
                          ? [{ name: '不限', id: 'all' }, ...levelsData[districtKey]]
                          : [],
                        districtKey,
                      )}
                    </li>
                  </ul>
                  <Button className={styles.button} type="primary" onClick={handleSubmit}>
                    确定
                  </Button>
                </>
              )}
            </div>
          </div>,
          document.getElementById(domId) || document.body,
        )}
      </div>
    </>
  );
};

MobileRegionalCascade.propTypes = {
  onChange: PropTypes.func,
  style: PropTypes.object,
  lang: PropTypes.string,
  shouldClearParams: PropTypes.bool,
};

export default MobileRegionalCascade;
