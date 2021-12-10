import React, { useMemo, useState, useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'antd';

import FormRender from 'form-render/lib/antd';

const defaultSchema = {
  schema: {
    type: 'object',
    properties: {
      select_ThngGs: {
        title: '单选',
        type: 'string',
        enum: ['a', 'b', 'c'],
        enumNames: ['早', '中', '晚'],
      },
      number_YGjmnx: {
        title: '数字输入框',
        type: 'number',
      },
      checkbox_jmWtWW: {
        title: '是否选择',
        type: 'boolean',
        'ui:widget': 'switch',
      },
      dateRange_q6r0VG: {
        title: '日期范围',
        type: 'range',
        format: 'dateTime',
        'ui:options': {
          placeholder: ['开始时间', '结束时间'],
        },
      },
      image_YwXaFQ: {
        title: '图片展示',
        type: 'string',
        format: 'image',
      },
      color_bVt8Yw: {
        title: '颜色选择',
        type: 'string',
        format: 'color',
      },
    },
  },
  displayType: 'row',
  showDescIcon: true,
  labelWidth: 120,
};

const SchemaForm = props => {
  const { style = {}, isHidden = true, otherCompParams = {}, getContainer, onChange } = props;

  const onChangeRef = useRef(null);
  onChangeRef.current = onChange;

  const {
    jsonSchema = defaultSchema,
    modalWidth = 960,
    modalHeight = 800,
    useDefaultModal = true,
  } = style;

  const { modalTitle = '', formSchema, submitId } = otherCompParams;

  const schema = useMemo(() => {
    try {
      let schema = JSON.parse(jsonSchema);
      if (formSchema && formSchema instanceof Object) {
        schema = formSchema;
      }
      return schema;
    } catch (error) {
      console.error(error);
      return {};
    }
  }, [jsonSchema, formSchema]);

  const [formData, setData] = useState({});
  const [valid, setValid] = useState([]);
  const [showValidate, setShowValidate] = useState(false);

  const _onOk = useCallback(() => {
    setShowValidate(true);
    if (valid.length > 0) {
      console.warn(`校验未通过字段：${valid.toString()}`);
    } else {
      console.info(JSON.stringify(formData, null, 2));
      onChangeRef.current && onChangeRef.current({ formData });
    }
  }, [formData, valid]);

  const submitRef = useRef(null);
  submitRef.current = _onOk;

  const _onCancel = useCallback(() => {
    console.log('Modal onCancel========--');
    onChangeRef.current && onChangeRef.current({});
  }, []);

  // 依据外部唯一ID值 提交表单
  useEffect(() => {
    console.log(submitId, 'submitId====');
    submitId && submitRef.current();
  }, [submitId]);

  return (
    <>
      {useDefaultModal ? (
        <Modal
          getContainer={getContainer()}
          title={modalTitle}
          width={modalWidth}
          height={modalHeight}
          visible={!isHidden}
          onCancel={_onCancel}
          onOk={_onOk}
          afterClose={() => setData({})}
        >
          <FormRender
            {...schema}
            formData={formData}
            onChange={setData}
            onValidate={setValid}
            showValidate={showValidate}
          />
        </Modal>
      ) : (
        <FormRender
          {...schema}
          formData={formData}
          onChange={setData}
          onValidate={setValid}
          showValidate={showValidate}
        />
      )}
    </>
  );
};

SchemaForm.propTypes = {
  style: PropTypes.object,
  otherCompParams: PropTypes.object,
  onChange: PropTypes.object,
  isHidden: PropTypes.bool,
  getContainer: PropTypes.func,
};

export default SchemaForm;
