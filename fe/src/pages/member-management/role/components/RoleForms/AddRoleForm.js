import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Form, Tabs, Input, Button, Spin } from 'antd';

import { fetchProjectList } from '@/service';

import DataPermission from './DataPermission';
import FeatPermission from './FeatPermission';
import styles from './index.less';

function AddRoleForm(props) {
  const { form, item, onClose, onSubmit, submitLoading } = props;
  const { getFieldDecorator, validateFields, setFieldsValue } = form;
  const [projectData, setProject] = useState([]);
  // 接口需要的参数：tagIdList、pageIdData( 选择的子页面，{[父ID]: [...id]} )
  const [tagIdList, setTagIds] = useState([]);
  const [pageIdData, setPageIdData] = useState({});
  // 接口需要的功能权限参数：
  const [featureData, setFeatData] = useState({});
  // Loading...
  const [projectLoading, setProjectLoading] = useState(false);

  const { id, name, des, pageIdData: itemPageData, tagIdList: itemTagIds, feature } = item || {};

  // 初始请求项目列表
  useEffect(() => {
    setProjectLoading(true);
    fetchProjectList({ pageSize: 999 }).then(res => {
      const { errorCode, data } = res || {};
      setProjectLoading(false);
      if (errorCode === 200) {
        setProject(data || []);
      }
    });
  }, []);

  // 编辑时，设置初始数据
  useEffect(() => {
    if (!id) return;
    setTagIds(itemTagIds || []);
    setPageIdData(itemPageData || {});
    setFeatData(feature || {});
  }, [itemTagIds, itemPageData, feature]);

  // perm验证
  useEffect(() => {
    let roleValue = [1];
    if (!tagIdList.length && !(Object.keys(pageIdData) || []).length) {
      roleValue = null;
    }
    setFieldsValue({ perm: roleValue });
  }, [tagIdList, pageIdData, setFieldsValue]);

  // 表单提交
  const onFormSave = () => {
    validateFields((errors, values) => {
      if (!errors) {
        const { name, des } = values;
        const params = { name, des, tagIdList, pageIdData, feature: featureData };
        if (id) {
          params.id = id;
        }
        onSubmit && onSubmit(params);
      }
    });
  };

  /************ 数据权限(选择所有+选择单个) ************/
  // 所有
  const onCheckAllData = useCallback(
    (event, id) => {
      let newIds = [...tagIdList];
      const childrenChecked = pageIdData[id] || [];

      if (event.target.checked) {
        newIds.push(id);
      } else {
        newIds = newIds.filter(i => i !== id);
      }
      // 点击全部，pageIdData里的项目都要删除
      const newPageId = { ...pageIdData };
      if (childrenChecked.length) {
        delete newPageId[id];
        setPageIdData(newPageId);
      }
      setTagIds(newIds);
    },
    [tagIdList, pageIdData],
  );

  // 单个
  const onCheckSingleData = useCallback(
    (checkedList, id) => {
      const newPageId = { ...pageIdData, [id]: checkedList };
      if (tagIdList.includes(id)) {
        const newIds = tagIdList.filter(i => i !== id);
        setTagIds(newIds);
      }

      setPageIdData(newPageId);
    },
    [tagIdList, pageIdData],
  );
  /************ 数据权限 ************/

  return (
    <React.Fragment>
      <Form className={styles.formMain}>
        <Form.Item label="名称">
          {getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: '请输入角色名称!',
              },
            ],
            initialValue: name || null,
          })(<Input placeholder="请输入角色名称" />)}
        </Form.Item>
        <Form.Item label="描述">
          {getFieldDecorator('des', {
            initialValue: des || null,
          })(<Input.TextArea placeholder="角色描述" autoSize={{ minRows: 2, maxRows: 6 }} />)}
        </Form.Item>
        <Form.Item label="权限">
          {getFieldDecorator('perm', {
            rules: [
              {
                required: true,
                message: '请选择用户页面权限!',
              },
            ],
          })(
            <Tabs className={styles.tabsContent}>
              <Tabs.TabPane tab="数据权限" key="data">
                <Spin spinning={projectLoading} size="small">
                  <DataPermission
                    projects={projectData}
                    tagIdList={tagIdList}
                    pageIdData={pageIdData}
                    onClickAll={onCheckAllData}
                    onClickSingle={onCheckSingleData}
                  />
                </Spin>
              </Tabs.TabPane>
              <Tabs.TabPane tab="功能权限" key="feature">
                <FeatPermission featureData={featureData} setFeatChecked={setFeatData} />
              </Tabs.TabPane>
            </Tabs>,
          )}
        </Form.Item>
      </Form>
      <div className={styles.formBtns}>
        <Button type="default" onClick={onClose}>
          取消
        </Button>
        <Button type="primary" onClick={onFormSave} loading={submitLoading}>
          保存
        </Button>
      </div>
    </React.Fragment>
  );
}

AddRoleForm.propTypes = {
  form: PropTypes.object,
  item: PropTypes.object,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  submitLoading: PropTypes.bool,
};

export default Form.create()(AddRoleForm);
