import React, { useState, useEffect, Fragment } from 'react';
// import router from 'umi/router';
// import PropTypes from 'prop-types';
import { CirclePicker } from 'react-color';
import { fetchPageList } from '@/service';
import AddTheme from '../AddTheme';
import HoverList from '@/components/HoverList';
import { Button, message, Modal, Divider, Form, Spin, Icon, Checkbox } from 'antd';
import styles from './index.less';
import { postDownload } from '@/helpers/download';
import { API_HOST } from '@/config/index';

const formItemLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 21 },
};

const DownloadPage = ({
  isSelectCompInfo,
  confirmLoading,
  modalLoading,
  form: { getFieldDecorator, getFieldsValue },
  spaning,
  getThemeList,
  dataSourceList = [],
}) => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const doFetch = async () => {
      const res = await fetchPageList();
      if (res.errorCode === 200) {
        setList(res.data);
      }
    };
    doFetch();
  }, []);
  const options = list.map(v => {
    return {
      label: v.name,
      value: v.id,
    };
  });

  const download = async () => {
    const pageIdList = getFieldsValue().list;
    setLoading(true);
    await postDownload({
      baseUrl: API_HOST,
      apiRoute: '/page/download/json',
      condition: {
        pageIdList,
      },
    });
    setLoading(false);
  };

  return (
    <div>
      <Form.Item label="选择页面" {...formItemLayout}>
        {getFieldDecorator('list', {
          initialValue: [],
          valuePropName: 'checked',
        })(<Checkbox.Group options={options} />)}
      </Form.Item>
      <Button type="primary" onClick={download} loading={loading}>
        下载
      </Button>
    </div>
  );
};

export default Form.create()(DownloadPage);
