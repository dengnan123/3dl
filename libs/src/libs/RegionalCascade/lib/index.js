import { useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import querystring from 'query-string';
import { reap } from '../../../components/SafeReaper';
import API from '../../../helpers/api';
import { getNameByLang } from '../../../helpers/lang';
import { filterDataFunc } from '../../../helpers/requestFilter';
import { Select, Spin, Empty } from 'antd';
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

const RegionalCascade = props => {
  const {
    style: {
      label = '选择区域',
      labelEn = 'Select Area',
      labelColor = '#4a4a4a',
      labelFontSize = 16,
      labelMarginRight = 10,
      fontColor = '#424242',
      fontSize = 14,
      opFontSize = 14,
      optionColor = 'rgba(0, 0, 0, 0.65)',
      optionBg,
      paddingTB = 5,
      paddingLR = 12,
      borderColor = '#D8D8D8',
      borderSize = 1,
      borderRadius = 4,
      cascadeWidthIsAverage = false,
      cascadeWidth = 120,
      cascadeMinWidth = 120,
      cascadeHeight = 32,
      cascadeSpacing = 10,
      method = 'get',
      defaultHeaderParams = [],
      apiHostEnvKey = 'API_HOST_COMP_PLACEHOLDER__',
      apiHost = 'https://www.fastmock.site/mock/29adb8c7e763fd69d52f9c23f533f21e/test',
      apiPath = '/list',
      cascadeLevels = [
        {
          label: '请选择省份',
          labelEn: '',
          nameKey: 'name',
          valueKey: 'id',
          defaultNameKey: 'provinceName',
          defaultValueKey: 'provinceId',
          compKey: 'province',
        },
        {
          label: '请选择城市',
          labelEn: '',
          nameKey: 'name',
          valueKey: 'id',
          defaultNameKey: 'cityName',
          defaultValueKey: 'cityId',
          compKey: 'city',
        },
        {
          label: '请选择行政区',
          labelEn: '',
          nameKey: 'name',
          valueKey: 'id',
          defaultNameKey: 'administrativeName',
          defaultValueKey: 'administrativeId',
          compKey: 'administrative',
        },
        {
          label: '请选择物业点',
          labelEn: '',
          nameKey: 'name',
          valueKey: 'id',
          defaultNameKey: 'propertyName',
          defaultValueKey: 'propertyId',
          compKey: 'property',
        },
      ],
      compKey = '',
      parmasFilterFunc = '',
      filterFunc = '',
    },
    onChange,
    lang = 'en-US',
    shouldClearParams,
  } = props;

  const urlParams = querystring.parse(decodeURI(window.location.search)) || {};

  const [levelsData, setLevelsData] = useState(new Array(cascadeLevels.length));
  // 下拉选择后的值(对象数组)
  const [levels, setLevels] = useState(new Array(cascadeLevels.length).fill({}));
  // loading状态
  const [loadings, setLoadings] = useState(new Array(cascadeLevels.length).fill(false));
  // 存储所有数据的大对象
  const [totalData, setTotalData] = useState({});
  // 请求头参数
  const headers = useMemo(() => {
    const obj = {};
    for (let i = 0; i < defaultHeaderParams.length; i++) {
      const item = defaultHeaderParams[i];
      const { paramKey, paramValue } = item;
      obj[paramKey] = paramValue;
    }
    return obj;
  }, [defaultHeaderParams]);

  // 请求url
  const apiUrl = useMemo(() => {
    const api_host = window.DP_ENV !== 'release' ? apiHost : apiHostEnvKey;
    const api = api_host + apiPath;
    return api;
  }, [apiHost, apiHostEnvKey, apiPath]);

  // 初始化数据
  useEffect(() => {
    if (cascadeLevels.length) {
      // loading状态
      const newLoadings = new Array(cascadeLevels.length).fill(false);
      let data = [];
      const newLevelsData = new Array(cascadeLevels.length);
      // 从url中获取默认值
      let obj = {};
      const _levels = [];

      const fetchData = async () => {
        // 上一级选中项信息
        let lastItem = { level: 0, id: 0, isFirstlevel: true };
        for (let i = 0; i < cascadeLevels.length; i++) {
          const item = cascadeLevels[i];
          const index = i;
          const key = reap(item, 'compKey', '');
          const nameKey = reap(item, 'nameKey', 'name');
          const valueKey = reap(item, 'valueKey', 'id');
          const defaultNameKey = reap(item, 'defaultNameKey', '');
          const defaultValueKey = reap(item, 'defaultValueKey', '');
          const name = urlParams[defaultNameKey];
          const value = urlParams[defaultValueKey];

          // api请求结果
          let res = null;

          obj[key] = {};

          // lastItem, 上一级没有默认值，则不拉取本级数据
          if (!apiUrl || !lastItem) {
            return;
          }
          // 拉取数据开始
          // api请求参数
          const apiParams = parmasFilterFunc
            ? filterDataFunc(parmasFilterFunc, {
                ...lastItem,
                index,
              })
            : { level: lastItem.level + 1, parentId: lastItem.id };

          newLoadings[index] = true;
          setLoadings(newLoadings);
          // 走转发接口
          res = await getData(proxyUrl, {
            condition: apiParams,
            cusHeaders: headers,
            dataApiUrl: apiUrl,
            methodType: method.toUpperCase(),
          });
          newLoadings[index] = false;
          setLoadings(newLoadings);
          // 处理数据
          data = reap(res, 'data', []);
          const resultList = filterFunc ? filterDataFunc(filterFunc, { dataSource: data }) : data;
          lastItem = resultList.find(
            item =>
              (name && `${item[nameKey]}` === name) ||
              (value && `${item[valueKey]}` === `${value}`),
          );
          newLevelsData[index] = [...resultList];
          obj[key] = lastItem;
          _levels.push(lastItem);
        }
      };

      fetchData().then(res => {
        setLevels(_levels);
        setLevelsData(newLevelsData);
        onChange && onChange({ [compKey]: obj, isInit: true });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiUrl]);

  // 判断是否需要重置
  useEffect(() => {
    if (shouldClearParams) {
      setLevels(new Array(cascadeLevels.length).fill({}));
    }
  }, [shouldClearParams, setLevels, cascadeLevels]);

  const onSelectChange = useCallback(
    async (value, dataSource, index, valueKey) => {
      const newLoadings = [...loadings];

      const newTotalData = { ...totalData };
      const currentValue = dataSource.find(n => n[valueKey] === value) || {};

      const newLevelsData = [...levelsData];
      let newLevels = [...levels];

      // 清空子集的选择数据以及下拉列表
      for (let i = index + 1; i < cascadeLevels.length; i++) {
        newLevels[i] = {};
        newLevelsData[i] = [];
        newLoadings[i] = false;
      }

      const params = parmasFilterFunc
        ? filterDataFunc(parmasFilterFunc, { ...currentValue, index })
        : { level: currentValue.level + 1, parentId: currentValue.id };

      // 判断数据是否已存在
      const hasData = newTotalData[value] ? true : false;

      newLevels[index] = { ...currentValue };
      newLevelsData[index + 1] = [];
      newLoadings[index + 1] = true;

      const obj = {};
      cascadeLevels.map((n, index) => {
        obj[n.compKey] = newLevels[index];
        return n;
      });

      onChange && onChange({ [compKey]: obj });
      setLevels(newLevels);
      setLevelsData(newLevelsData);

      if (apiUrl && !hasData && index < cascadeLevels.length - 1) {
        let res = {};
        setLoadings(newLoadings);
        res = await getData(proxyUrl, {
          condition: params,
          cusHeaders: headers,
          dataApiUrl: apiUrl,
          methodType: method.toUpperCase(),
        });
        newLoadings[index + 1] = false;
        setLoadings(newLoadings);

        const data = reap(res, 'data', []);
        const _data = filterFunc ? filterDataFunc(filterFunc, data) : data;
        newLevelsData[index + 1] = _data;
        newTotalData[value] = _data;
      }

      if (hasData) {
        newLevelsData[index + 1] = newTotalData[value];
      }

      setLevelsData(newLevelsData);
      setTotalData(newTotalData);
    },
    [
      loadings,
      totalData,
      levelsData,
      levels,
      parmasFilterFunc,
      cascadeLevels,
      compKey,
      onChange,
      apiUrl,
      method,
      filterFunc,
      headers,
    ],
  );

  return (
    <div className={styles.container}>
      <div
        className={styles.label}
        style={{ marginRight: labelMarginRight, color: labelColor, fontSize: labelFontSize }}
      >
        {getNameByLang(lang, label, labelEn)}：
      </div>
      {cascadeLevels.map((d, index) => {
        const initPlaceholder = lang === 'zh-CN' ? '请选择' : 'Please Select';
        const placeholder = getNameByLang(lang, d.label, d.labelEn) || initPlaceholder;
        const selectList = levelsData[index] || [];
        const nameKey = reap(d, 'nameKey', 'name');
        const valueKey = reap(d, 'valueKey', 'id');

        return (
          <Select
            style={{
              width: cascadeWidth,
              minWidth: cascadeMinWidth,
              height: cascadeHeight,
              lineHeight: `${cascadeHeight - 2 * borderSize}px`,
              marginRight: index === cascadeLevels.length - 1 ? 0 : cascadeSpacing,
              color: fontColor,
              fontSize,
              border: `${borderSize}px solid ${borderColor}`,
              borderRadius,
            }}
            dropdownStyle={{ marginTop: cascadeHeight + 4 }}
            className={cascadeWidthIsAverage ? styles.averageWidth : null}
            onChange={value => onSelectChange(value, selectList, index, valueKey)}
            key={index}
            value={(levels[index] || {})[valueKey]}
            placeholder={placeholder}
            allowClear={true}
            notFoundContent={
              loadings[index] ? (
                <Spin spinning={true} />
              ) : (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              )
            }
            getPopupContainer={triggerElement => triggerElement}
          >
            {(selectList || []).map((n, i) => (
              <Select.Option
                key={i}
                value={n[valueKey]}
                style={{
                  fontSize: opFontSize,
                  lineHeight: `${cascadeHeight - paddingTB * 2}px`,
                  background: optionBg,
                  color: optionColor,
                  textAlign: 'left',
                  padding: `${paddingTB}px ${paddingLR}px`,
                }}
              >
                {getNameByLang(lang, n[nameKey], n[`${nameKey}En`])}
              </Select.Option>
            ))}
          </Select>
        );
      })}
    </div>
  );
};

RegionalCascade.propTypes = {
  onChange: PropTypes.func,
  style: PropTypes.object,
  lang: PropTypes.string,
  shouldClearParams: PropTypes.bool,
};

export default RegionalCascade;
