import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { reap } from '../../../components/SafeReaper';
import API from '../../../helpers/api';
import { Modal, Spin } from 'antd';
import SwitchIcon from '../assets/switch.png';
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

const totalPartitionItem = { id: 'all', name: '全行' };
const totalPropertyPointItem = { id: 'all', name: '全部' };

// 请求头参数
const headers = { 'DF-Account-ID': 1, 'df-project-id': 1, 'df-tenant-id': 1 };

function DataPilotCascade(props) {
  const { onChange, shouldClearParams, style, isHidden } = props;

  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const [visible, setVisible] = useState(true);

  // 记录上一次选择的值
  const [initSelectData, setInitSelectData] = useState({
    selectPartition: totalPartitionItem,
    selectPropertyPoint: totalPropertyPointItem,
  });

  // 下拉列表
  const [{ partitionList, propertyPointList }, setList] = useState({
    partitionList: [],
    propertyPointList: [],
  });

  // loading状态
  const [{ partitionListLoading, propertyPointListLoading }, setLoading] = useState({
    partitionListLoading: false,
    propertyPointListLoading: false,
  });

  // 下拉选择后的值
  const [{ selectPartition, selectPropertyPoint }, setSelectData] = useState({
    selectPartition: totalPartitionItem,
    selectPropertyPoint: totalPropertyPointItem,
  });

  const {
    compKey,
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

  // 初始化数据
  useEffect(() => {
    const fetchData = async () => {
      if (!apiUrl) {
        return;
      }
      setLoading(state => ({ ...state, partitionListLoading: true }));
      // api请求结果
      const res = await getData(proxyUrl, {
        condition: { parentId: 0, level: 1 },
        cusHeaders: headers,
        dataApiUrl: apiUrl,
        methodType: 'GET',
      });
      setLoading(state => ({ ...state, partitionListLoading: false }));

      // 处理数据
      const partitionList = reap(res, 'data', []);
      setList(state => ({ ...state, partitionList }));
    };

    fetchData();
  }, [apiUrl]);

  // 选择分区
  const onPartitionSelectChange = useCallback(
    async value => {
      const { id, level } = value;

      setList(state => ({ ...state, propertyPointList: [] }));
      setSelectData(state => ({ ...state, selectPartition: value }));
      setLoading(state => ({ ...state, propertyPointListLoading: true }));
      const res = await getData(proxyUrl, {
        condition: { level: level + 1, parentId: id },
        cusHeaders: headers,
        dataApiUrl: apiUrl,
        methodType: 'GET',
      });

      const propertyPointList = reap(res, 'data', []);
      setList(state => ({ ...state, propertyPointList }));
      setLoading(state => ({ ...state, propertyPointListLoading: false }));
    },
    [apiUrl],
  );

  const handleToSelect = useCallback(() => {
    setVisible(true);
  }, []);

  // 选择分区
  const onPropertyPointSelectChange = useCallback(value => {
    setSelectData(state => ({ ...state, selectPropertyPoint: value }));
  }, []);

  const handleCancel = useCallback(() => {
    setVisible(false);
    setSelectData(initSelectData);
  }, [initSelectData]);

  const handleSubmit = useCallback(() => {
    setInitSelectData({ selectPartition, selectPropertyPoint });
    setVisible(false);
    console.log({ [compKey]: { _type: 'ok', selectPartition, selectPropertyPoint } });
    onChangeRef.current &&
      onChangeRef.current({ [compKey]: { _type: 'ok', selectPartition, selectPropertyPoint } });
  }, [compKey, selectPartition, selectPropertyPoint]);

  // 判断是否需要重置
  useEffect(() => {
    if (shouldClearParams) {
      setInitSelectData({
        selectPartition: totalPartitionItem,
        selectPropertyPoint: totalPropertyPointItem,
      });
      setSelectData({
        selectPartition: totalPartitionItem,
        selectPropertyPoint: totalPropertyPointItem,
      });
      setList(state => ({ ...state, propertyPointList: [] }));
      onChangeRef.current &&
        onChangeRef.current({
          [compKey]: {
            _type: 'reset',
            selectPartition: totalPartitionItem,
            selectPropertyPoint: totalPropertyPointItem,
          },
        });
    }
  }, [shouldClearParams, compKey]);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.item} onClick={handleToSelect}>
          <img src={SwitchIcon} alt="icon" />
          <span className={styles.text}>
            {initSelectData?.selectPropertyPoint?.name || initSelectData?.selectPartition?.name}
          </span>
        </div>
        <Modal
          className={styles.modal}
          visible={!isHidden ? visible : false}
          footer={null}
          title={null}
          mask={false}
          onCancel={handleCancel}
          onOk={handleSubmit}
        >
          <div className={styles.modelContainer}>
            <h4 className={styles.head}>选择分区</h4>
            <ul className={styles.cascade}>
              <li>
                <p className={styles.title}>分区</p>
                <div className={styles.content}>
                  {!partitionListLoading ? (
                    [totalPartitionItem, ...partitionList]?.map(n => {
                      const { id, name } = n;
                      const active = selectPartition?.id === id;
                      return (
                        <div
                          key={id}
                          className={classnames(styles.selectItem, { [styles.active]: active })}
                          onClick={active ? null : () => onPartitionSelectChange(n)}
                        >
                          {name}
                        </div>
                      );
                    })
                  ) : (
                    <Spin
                      spinning={true}
                      style={{ margin: '0 auto', display: 'block', lineHeight: '160px' }}
                    />
                  )}
                </div>
              </li>
              <li>
                <p className={styles.title}>物业点</p>
                <div className={styles.content}>
                  {!propertyPointListLoading ? (
                    [totalPropertyPointItem, ...propertyPointList]?.map(n => {
                      const { id, name } = n;
                      const active = selectPropertyPoint?.id === id;
                      return (
                        <div
                          key={id}
                          className={classnames(styles.selectItem, { [styles.active]: active })}
                          onClick={active ? null : () => onPropertyPointSelectChange(n)}
                        >
                          {name}
                        </div>
                      );
                    })
                  ) : (
                    <Spin
                      spinning={true}
                      style={{ margin: '0 auto', display: 'block', lineHeight: '160px' }}
                    />
                  )}
                </div>
              </li>
            </ul>

            <div className={styles.operate}>
              <span className={styles.cancelBtn} type="primary" onClick={handleCancel}>
                取消
              </span>
              <span className={styles.okBtn} type="primary" onClick={handleSubmit}>
                确定
              </span>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
}

DataPilotCascade.propTypes = {
  onChange: PropTypes.func,
  style: PropTypes.object,
  lang: PropTypes.string,
  shouldClearParams: PropTypes.bool,
  isHidden: PropTypes.bool,
};

export default DataPilotCascade;
