import React, { useState } from 'react';
import { Spin, Table, Button, Icon, Modal, Drawer } from 'antd';
import classnames from 'classnames';

// import { queryTagsList } from '@/service';

import { WEATHER_ARRAY } from '../util';

import WeatherHeaderFilter from './components/HeaderFilter';
import SvgDetail from './components/SvgDetail';
import AddCodeForm from './components/AddCodeForm';
import styles from './index.less';

function WeatherManage(props) {
  // const [listLoading, setListLoading] = useState(false);
  // const [data, setData] = useState({});
  const [isInitialized, setInitial] = useState(true);
  const [addVisible, setAddVisible] = useState(false);
  const [checkVisible, setCheckVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState({});

  const onAddClick = () => {
    setAddVisible(true);
  };

  const onSvgClick = item => {
    setCheckVisible(true);
    setCurrentItem(item);
  };

  const onClose = () => {
    setAddVisible(false);
    setCheckVisible(false);
    setCurrentItem({});
  };

  const queryCodeList = values => {
    console.log(values, '====query values');
    setInitial(false);
  };

  const onEditSubmit = values => {
    console.log(values, '====EditSubmit values');
    setInitial(true);
  };

  const onAddSubmit = values => {
    console.log(values, '====addSubmit values');
    setInitial(true);
  };

  const _getColumns = () => {
    return [
      {
        title: 'Code',
        dataIndex: 'code',
        align: 'center',
      },
      {
        title: 'SVG名称',
        dataIndex: 'name',
        align: 'center',
        render: (text, record) => {
          return text;
          // return <span className={styles.svgName}>{text}</span>;
        },
      },

      {
        title: '操作',
        dataIndex: 'action',
        align: 'center',
        className: styles.tableLastColumn,
        render: (text, record) => {
          return (
            <React.Fragment>
              <Button
                type="link"
                style={{ marginRight: '0px' }}
                onClick={() => onSvgClick({ ...record })}
              >
                <Icon type="edit" />
                查看
              </Button>
            </React.Fragment>
          );
        },
      },
    ];
  };

  return (
    <>
      <section className={styles.wContent}>
        <WeatherHeaderFilter
          isInitialized={isInitialized}
          onAddClick={onAddClick}
          onSearch={queryCodeList}
        />
        <Spin spinning={false} size="small">
          <Table
            className={classnames('dm-table-primary', styles.table)}
            columns={_getColumns()}
            dataSource={WEATHER_ARRAY || []}
            pagination={false}
            rowKey="code"
          />
        </Spin>
      </section>
      <Drawer
        title={currentItem?.code}
        placement="right"
        maskClosable={false}
        onClose={onClose}
        visible={checkVisible}
        width={400}
      >
        {checkVisible && <SvgDetail info={currentItem} onClose={onClose} onOk={onEditSubmit} />}
      </Drawer>
      <Modal
        title={'添加code'}
        visible={addVisible}
        destroyOnClose={true}
        maskClosable={false}
        footer={null}
        onCancel={onClose}
        width={600}
      >
        {addVisible && <AddCodeForm info={currentItem} onClose={onClose} onOk={onAddSubmit} />}
      </Modal>
    </>
  );
}

WeatherManage.propTypes = {};

export default WeatherManage;
