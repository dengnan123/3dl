import { Button, Drawer, Table, Tag } from 'antd';
import { useState } from 'react';
import DataConfig from '@/components/DataConfig';
import UseTableEnhance from '@/components/UseTableEnhance';
import classnames from 'classnames';
import styles from './index.less';
import { findTagList, addTag } from '@/service/tag';

const ProjectList = () => {
  const [vis, setVis] = useState(false);

  // const dataConfigProps = {

  //   getAllDataSourceByPageId,
  //   dataSourceList,
  // };

  const onClose = () => {
    setVis(false);
  };

  const columns = [
    {
      title: '项目名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Button
          type="link"
          onClick={() => {
            setVis(true);
          }}
        >
          数据配置
        </Button>
      ),
    },
  ];

  const tableProps = {
    fetchListApi: findTagList,
    addApi: addTag,
    columns,
  };

  return (
    <div>
      <UseTableEnhance {...tableProps}></UseTableEnhance>
      <Drawer visible={vis} onClose={onClose}>
        <DataConfig></DataConfig>
      </Drawer>
    </div>
  );
};

export default ProjectList;
