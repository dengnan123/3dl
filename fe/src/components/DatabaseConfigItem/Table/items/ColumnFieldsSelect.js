import React, { useMemo, forwardRef, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import shortUUID from 'short-uuid';
import { useUpdateState } from '@/hooks/index';
import { DataFormatTypeEnum, DataFormatTypeLabelEnum } from '@/helpers/database';
import { formatColumnsByGData } from '@/helpers/database/table';
import { isNullOrUndefined } from '@/helpers/animation/util';
import {
  Form,
  Select,
  Tree,
  Switch,
  Input,
  Button,
  Modal,
  Card,
  Row,
  Col,
  Empty,
  message,
  Table,
} from 'antd';

import styles from './ColumnFieldsSelect.less';

const { TreeNode } = Tree;

function ColumnFieldsSelect(props) {
  const { onChange, value, columnList } = props;
  const [{ visible }, updateState] = useUpdateState({ visible: false });

  const onEdit = useCallback(() => {
    updateState({ visible: true });
  }, [updateState]);

  const onCancel = useCallback(() => {
    updateState({ visible: false });
  }, [updateState]);

  const onOk = useCallback(
    value => {
      onChange(value);
      onCancel();
    },
    [onChange, onCancel],
  );

  return (
    <section className={styles.section}>
      <Button onClick={onEdit}>编辑</Button>

      <EditColumnTreeForm
        visible={visible}
        value={value}
        columnList={columnList}
        onOk={onOk}
        onCancel={onCancel}
      />
    </section>
  );
}

export default forwardRef((props, ref) => <ColumnFieldsSelect {...props} />);

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

/**
 * 添加模式
 * @enum
 */
const AddModeTypeEnum = {
  /** 添加顶级 */
  AddTop: 'addTop',
  /** 添加下级 */
  AddChildren: 'addChildren',
};

const resetValues = {
  /** 添加下级时用到 */
  parentNode: null,
  selectedNode: null,
  selectedKeys: [],
  // 是否新增
  isAdd: true,
  // 新增模式，顶级还是下级
  addMode: AddModeTypeEnum.AddTop,
};
function EditColumnTree(props) {
  const { onOk, onCancel, form, value, visible, columnList } = props;
  const [
    { gData, gDataHash, parentNode, selectedNode, selectedKeys, isAdd, addMode },
    updateState,
  ] = useUpdateState({
    /**
     * 树形结构数据，只包含key属性，其余属性存在gDataHash中
     */
    gData: [],
    gDataHash: {},
    ...resetValues,
  });

  const { getFieldDecorator, validateFieldsAndScroll, resetFields } = form;

  // 初始化数据
  useEffect(() => {
    if (!visible) {
      return;
    }
    // 弹窗显示的时候更新数据
    const initGData = value?.gData || [];
    const initGDataHash = value?.gDataHash || {};
    updateState({ gData: initGData, gDataHash: initGDataHash });
  }, [value, visible, updateState]);

  const handleOk = useCallback(() => {
    onOk({ gData, gDataHash });
  }, [gData, gDataHash, onOk]);

  // 选择
  const handleTreeSelect = useCallback(
    (selectedKeys, { selected, selectedNodes, node, event }) => {
      updateState({
        selectedNode: selectedNodes?.[0]?.props?.data,
        selectedKeys,
        isAdd: !selected,
      });
      resetFields();
    },
    [updateState, resetFields],
  );

  // 添加顶级
  const handleAddTop = useCallback(() => {
    const key = shortUUID.generate();
    const selectedNode = { key, isGroup: true, dataIndex: key };
    updateState({ selectedNode, selectedKeys: [], isAdd: true, addMode: AddModeTypeEnum.AddTop });
  }, [updateState]);

  // 添加下级
  const handleAddChildren = useCallback(() => {
    const key = shortUUID.generate();
    const newSelectedNode = { key, isGroup: true, dataIndex: key };
    updateState({
      parentNode: selectedNode,
      selectedNode: newSelectedNode,
      selectedKeys: [],
      isAdd: true,
      addMode: AddModeTypeEnum.AddChildren,
    });
  }, [updateState, selectedNode]);

  // 删除
  const handleDelete = useCallback(() => {
    let deleteChildren = [];
    let newGData = loop(gData) || [];
    let newGDataHash = { ...gDataHash };
    let deleteKeys = getDeleteKeys(deleteChildren);
    [...deleteKeys, selectedNode.key].forEach(k => {
      delete newGDataHash[k];
    });

    updateState({ ...resetValues, gData: newGData, gDataHash: newGDataHash });
    function loop(list) {
      return list?.filter(n => {
        const isCurrent = n.key === selectedNode.key;
        if (!!n.children?.length) {
          n.children = loop(n.children);
        }
        if (isCurrent) {
          deleteChildren = n.children;
        }
        return !isCurrent;
      });
    }

    function getDeleteKeys(list) {
      return (
        list?.reduce((total, current) => {
          return [...total, current.key, ...getDeleteKeys(current.children)];
        }, []) || []
      );
    }
  }, [selectedNode, gData, gDataHash, updateState]);

  const handleSave = useCallback(() => {
    validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return;
      }
      const { key } = values;
      let newGData = [...gData];
      let newGDataHash = { ...gDataHash };
      // 编辑
      if (!isAdd) {
        newGDataHash[key] = { ...newGDataHash[key], ...values };
        updateState({ gDataHash: newGDataHash, ...resetValues });
        return;
      }
      newGDataHash[key] = values;
      // 添加顶级
      if (addMode === AddModeTypeEnum.AddTop) {
        newGData.push({ key });
        updateState({
          gData: newGData,
          gDataHash: newGDataHash,
          ...resetValues,
        });
        return;
      }
      // 添加下级
      function loop(list) {
        for (let i = 0; i < list?.length; i++) {
          if (list[i].key === parentNode.key) {
            if (!!list[i].children?.length) {
              list[i].children.push({ key });
            } else {
              list[i].children = [{ key }];
            }
            return;
          }
          loop(list[i].children);
        }
      }
      loop(newGData);
      updateState({
        gData: newGData,
        gDataHash: newGDataHash,
        ...resetValues,
      });
    });
  }, [gData, gDataHash, parentNode, isAdd, addMode, validateFieldsAndScroll, updateState]);

  const onDrop = useCallback(
    info => {
      const dropToGap = info.dropToGap;
      const dropKey = info.node.props.eventKey;
      const dragKey = info.dragNode.props.eventKey;
      const dropPos = info.node.props.pos.split('-');
      const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);
      const targetNodeData = info.node.props.data;

      /**
       * 不能在数据库返回的字段下添加子节点
       */
      if (!dropToGap && !targetNodeData.isGroup) {
        message.warn('只能将节点移动到类型是组的节点');
        return;
      }

      const loop = (data, key, callback) => {
        data.forEach((item, index, arr) => {
          if (item.key === key) {
            return callback(item, index, arr);
          }
          if (item.children) {
            return loop(item.children, key, callback);
          }
        });
      };
      const data = [...gData];

      // Find dragObject
      let dragObj;
      loop(data, dragKey, (item, index, arr) => {
        arr.splice(index, 1);
        dragObj = item;
      });

      if (!info.dropToGap) {
        // Drop on the content
        loop(data, dropKey, item => {
          item.children = item.children || [];
          // where to insert 示例添加到尾部，可以是随意位置
          item.children.push(dragObj);
        });
      } else if (
        (info.node.props.children || []).length > 0 && // Has children
        info.node.props.expanded && // Is expanded
        dropPosition === 1 // On the bottom gap
      ) {
        loop(data, dropKey, item => {
          item.children = item.children || [];
          // where to insert 示例添加到头部，可以是随意位置
          item.children.unshift(dragObj);
        });
      } else {
        let ar;
        let i;
        loop(data, dropKey, (item, index, arr) => {
          ar = arr;
          i = index;
        });
        if (dropPosition === -1) {
          ar.splice(i, 0, dragObj);
        } else {
          ar.splice(i + 1, 0, dragObj);
        }
      }

      updateState({ gData: data });
    },
    [gData, updateState],
  );

  const renderNode = useCallback(
    data =>
      data?.map(item => {
        const hashItemData = gDataHash[item.key] || {};
        if (item.children && item.children.length) {
          return (
            <TreeNode
              key={item.key}
              title={hashItemData.title ?? hashItemData.dataIndex}
              data={hashItemData}
            >
              {renderNode(item.children)}
            </TreeNode>
          );
        }
        return (
          <TreeNode
            key={item.key}
            title={hashItemData.title ?? hashItemData.dataIndex}
            data={hashItemData}
          />
        );
      }),
    [gDataHash],
  );

  const handleSelectChange = useCallback(
    name => {
      if (isNullOrUndefined(name)) {
        return;
      }
      const newSelectedNode = { ...selectedNode, dataIndex: name, isGroup: false };
      updateState({ selectedNode: newSelectedNode });
      resetFields();
    },
    [resetFields, updateState, selectedNode],
  );

  const fastInputFormVisible = useMemo(() => {
    // 如果 selectedNode 没有值
    if (!selectedNode) {
      return false;
    }
    // 如果是新增
    if (isAdd) {
      return true;
    }
    // 如果节点类型是组
    if (!!selectedNode.isGroup) {
      return false;
    }
    return true;
  }, [selectedNode, isAdd]);

  const columns = useMemo(() => {
    return formatColumnsByGData({ gData, gDataHash });
  }, [gData, gDataHash]);
  console.log('columns', columns);

  return (
    <Modal
      title="编辑表格列"
      width={1300}
      height={600}
      visible={visible}
      onOk={handleOk}
      onCancel={onCancel}
    >
      <Row className={styles.editTree} gutter={[15, 15]}>
        <Col span={10}>
          <Card
            title={
              <>
                <Button type="primary" className={styles.btn} onClick={handleAddTop}>
                  添加顶级
                </Button>
                <Button
                  type="primary"
                  // 没有选择节点或者选择的节点是自定义添加的节点
                  disabled={!selectedNode || !selectedNode.isGroup}
                  onClick={handleAddChildren}
                >
                  添加下级
                </Button>
              </>
            }
            className={styles.card}
          >
            <Tree
              showLine
              draggable
              blockNode
              defaultExpandAll={true}
              selectedKeys={selectedKeys}
              onSelect={handleTreeSelect}
              onDrop={onDrop}
            >
              {renderNode(gData)}
            </Tree>
          </Card>
        </Col>
        <Col span={14}>
          <Card
            title={
              fastInputFormVisible && (
                <>
                  <span style={{ marginRight: 10 }}>快速填充表单：</span>
                  <Select
                    placeholder="可用字段"
                    style={{ width: 200 }}
                    onChange={handleSelectChange}
                  >
                    {columnList?.map(n => {
                      return (
                        <Select.Option key={n?.name} value={n?.name}>
                          {n?.name}
                        </Select.Option>
                      );
                    })}
                  </Select>
                </>
              )
            }
            extra={
              <>
                <Button
                  disabled={!selectedNode || isAdd}
                  type="danger"
                  className={styles.btn}
                  onClick={handleDelete}
                >
                  删除
                </Button>
                <Button disabled={!selectedNode} type="primary" onClick={handleSave}>
                  保存
                </Button>
              </>
            }
            className={styles.card}
          >
            {selectedNode ? (
              <>
                <Form.Item label="key" {...formItemLayout}>
                  {getFieldDecorator('key', { initialValue: selectedNode?.key })(
                    <Input disabled />,
                  )}
                </Form.Item>
                <Form.Item label="节点类型(是否是组)" {...formItemLayout}>
                  {getFieldDecorator('isGroup', {
                    initialValue: selectedNode?.isGroup,
                    valuePropName: 'checked',
                  })(<Switch disabled checkedChildren="是" unCheckedChildren="否" />)}
                </Form.Item>
                <Form.Item label="标题" {...formItemLayout}>
                  {getFieldDecorator('title', {
                    initialValue: selectedNode?.title,
                  })(<Input placeholder="请输入标题" />)}
                </Form.Item>
                {!selectedNode.isGroup && (
                  <>
                    <Form.Item label="标题映射(dataIndex)" {...formItemLayout}>
                      {getFieldDecorator('dataIndex', { initialValue: selectedNode?.dataIndex })(
                        <Input disabled />,
                      )}
                    </Form.Item>
                    <Form.Item label="数据显示方式" {...formItemLayout}>
                      {getFieldDecorator('dataFormatType', {
                        initialValue: selectedNode?.dataFormatType,
                      })(
                        <Select placeholder="数据显示方式" allowClear>
                          {Object.values(DataFormatTypeEnum).map(v => (
                            <Select.Option key={v} value={v}>
                              {DataFormatTypeLabelEnum[v]}
                            </Select.Option>
                          ))}
                        </Select>,
                      )}
                    </Form.Item>
                  </>
                )}
              </>
            ) : (
              <Empty description="请先选择左侧节点" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </Card>
        </Col>
      </Row>
      {!!columns?.length && (
        <Row>
          <Table
            rowKey={(row, index) => index}
            size="small"
            bordered
            pagination={false}
            columns={columns}
            dataSource={[
              {
                id: 1,
                'sum(a.alloted)': 20,
                'sum(a.capacity)': 40,
                data_month: 1619688404890,
                building_name: '上海大楼',
              },
            ]}
          />
        </Row>
      )}
    </Modal>
  );
}

EditColumnTree.prototype = {
  onOk: PropTypes.func,
  onCancel: PropTypes.func,
  form: PropTypes.object,
};

const EditColumnTreeForm = Form.create()(EditColumnTree);
