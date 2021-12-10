import React, { useState, useEffect, useRef } from 'react';
import { Spin, Table, Button, Row, Col, Input, Divider } from 'antd';
import AxiosAPI from 'axios';
import classnames from 'classnames';

import { FENGMAP_API_HOST } from '@/config';

import styles from './index.less';

const updateUrl = `${FENGMAP_API_HOST}/crawlonce`;
const listUrl = `${FENGMAP_API_HOST}/status`;

function FengmapManage(props) {
  const containerRef = useRef(null);
  const [cHeight, setHeight] = useState(500);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(false);
  const [mapList, setMapList] = useState([]);
  const [sValue, setSearchValue] = useState(null);
  const [searchList, setSearchList] = useState([]);

  useEffect(() => {
    if (containerRef.current) {
      const divDom = containerRef.current;
      setHeight(divDom.offsetHeight - 70);
    }
  }, []);

  useEffect(() => {
    queryFengmapList && queryFengmapList();
  }, []);

  const onUpdateFengmap = () => {
    setLoading(true);
    AxiosAPI({
      method: 'get',
      url: updateUrl,
    }).then(res => {
      setLoading(false);
    });
  };

  const queryFengmapList = () => {
    setListLoading(true);
    AxiosAPI({
      method: 'get',
      url: listUrl,
    }).then(res => {
      const data = res?.data?.data?.mapList || [];
      setListLoading(false);
      setMapList(data);
      setSearchValue(null);
    });
  };

  const onInputChange = ev => {
    const value = ev?.target?.value;
    setSearchValue(value);
    if (!value) {
      setSearchList(mapList);
      return;
    }
    const sList = mapList.filter(i => {
      const { mapName, mapId } = i;
      return mapName.includes(value) || mapId.includes(value);
    });
    setSearchList(sList);
  };

  const _getColumns = () => {
    return [
      {
        title: '地图名称',
        dataIndex: 'mapName',
        align: 'center',
      },
      {
        title: '地图ID',
        dataIndex: 'mapId',
        align: 'center',
      },
      {
        title: '主题ID',
        dataIndex: 'id',
        align: 'center',
      },
    ];
  };

  const total = mapList.length;

  return (
    <section className={styles.fContent}>
      <Row>
        <Col span={12} className={styles.item}>
          <span>地图主题列表:</span>
          <Button
            type="primary"
            onClick={queryFengmapList}
            loading={listLoading}
            disabled={loading}
          >
            列表刷新
          </Button>
        </Col>
        <Col span={12} className={styles.item}>
          <span>地图主题更新:</span>
          <Button type="primary" onClick={onUpdateFengmap} loading={loading} disabled={listLoading}>
            地图下载更新
          </Button>
        </Col>
      </Row>

      <Divider />
      <div className={styles.mapHeader}>
        <div className={styles.topLeft}>
          共 <i>{total}</i> 个地图
        </div>
        <div className={styles.topRight}>
          <Input placeholder="输入地图名称/id进行搜索" onChange={onInputChange} value={sValue} />
        </div>
      </div>
      <div ref={containerRef} className={styles.box}>
        <Spin spinning={listLoading} size="small">
          <Table
            className={classnames('dm-table-primary', styles.table)}
            columns={_getColumns()}
            dataSource={sValue ? searchList : mapList}
            pagination={false}
            rowKey="id"
            scroll={{ y: cHeight }}
          />
        </Spin>
      </div>
    </section>
  );
}

FengmapManage.propTypes = {};

export default FengmapManage;
