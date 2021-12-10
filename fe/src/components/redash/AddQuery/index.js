import { useState, useEffect, useRef } from 'react';
import { Form, Input, Button, message, Row, Col } from 'antd';
import { ResizableBox } from 'react-resizable';

import { useDoQuery } from '@/hooks/redash';
import AceEditor from '@/components/AceEditor';
import { DatabaseConfigItem } from '@/components';
import { useGetQueryParameters, useParameters } from '../hooks';
import Parameters from '../Parameters';
import RenderTable from '../RenderTable';
import styles from './index.less';

const exampleEditProps = {
  language: 'javascript',
  titleFiledArr: [],
  showFooter: false,
  showFullScreen: false,
};

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
};

const Add = ({
  form: { getFieldValue, getFieldDecorator, setFieldsValue },
  data_source_id,
  form,
  nowQuery,
  fieldsMap,
}) => {
  const wrapperRef = useRef(null);
  const [currentHeight, setEditorHeight] = useState(200);
  const query = getFieldValue('query');
  const [data] = useGetQueryParameters(query);
  const [parameters, setV] = useParameters(nowQuery?.options?.parameters, data);
  const { doApi, loading, data: queryData } = useDoQuery();
  const [tbVis, setVis] = useState(false);
  const doQuery = async () => {
    const query = getFieldValue('query');
    if (!query) {
      message.warning('no  query');
      return;
    }
    console.log('parametersparametersparameters', parameters);
    const hashParameters = parameters.reduce((pre, next) => {
      const { name, value, type } = next;
      return {
        ...pre,
        [name]: {
          value,
          type,
          isRequired: next.isRequired ?? true,
        },
      };
    }, {});
    const data = await doApi({
      query,
      parameters: hashParameters,
      data_source_id,
    });
    if (data.errorCode !== 200) {
      message.warning(data.message);
      return;
    }
    setVis(true);
  };

  useEffect(() => {
    getFieldDecorator('parameters', { initialValue: parameters });
  }, [parameters, getFieldDecorator]);

  const onEditorResize = (ev, record) => {
    const { size } = record || {};
    setEditorHeight(size?.height);
  };

  const { offsetWidth } = wrapperRef.current || {};
  const width = offsetWidth ? offsetWidth : 800;
  const tableHeight = 1000 - currentHeight - 160;

  return (
    <div className={styles.wrap} ref={wrapperRef}>
      <Form>
        <Form.Item label="">
          {getFieldDecorator('name', {
            initialValue: nowQuery?.name || '',
            rules: [{ required: true, message: '请输入查询名称' }],
          })(<Input placeholder="请输入接口名称" />)}
        </Form.Item>

        <h4>
          <span>语句:</span>
          <Button
            type="primary"
            size="small"
            onClick={() => {
              doQuery();
            }}
            loading={loading}
          >
            查询数据
          </Button>
        </h4>

        <ResizableBox
          className={styles.resizableBox}
          width={width}
          height={200}
          minConstraints={[width, 60]}
          maxConstraints={[width, 500]}
          axis="y"
          onResize={onEditorResize}
        >
          <Form.Item label="">
            {getFieldDecorator('query', {
              initialValue: nowQuery?.query,
              rules: [{ required: true, message: '请输入查询语句' }],
            })(<AceEditor {...exampleEditProps} width={width} height={currentHeight}></AceEditor>)}
          </Form.Item>
        </ResizableBox>

        {parameters?.length === 0 ? (
          <p className={styles.tips}>设置测试条件: 暂无变量</p>
        ) : (
          <Parameters placeholder="请输入接口名称" value={parameters} onChange={setV} />
        )}

        <section className={styles.config}>
          <DatabaseConfigItem.AntdTable
            form={form}
            queryData={queryData}
            formItemLayout={formItemLayout}
            data={{ ...nowQuery?.options }}
            itemProps={{ fields: { labelAlign: 'left' }, groupBy: { labelAlign: 'left' } }}
          />
        </section>
      </Form>
      {tbVis && (
        <div className={styles.table} style={{ height: tableHeight }}>
          <RenderTable data={queryData} keysMap={fieldsMap}></RenderTable>
        </div>
      )}
    </div>
  );
};

export default Add;
