import React, { useEffect, useState } from 'react';
import { Form, Input } from 'antd';
import html2canvas from 'html2canvas';

const SaveThemeConfig = props => {
  const {
    formItemLayout,
    form: { getFieldDecorator, setFieldsValue },
    isSelectCompInfo,
  } = props;

  const { id, compName } = isSelectCompInfo;

  const [imageSrc, setSrc] = useState(null);
  const compId = `${id}_${compName}`;
  useEffect(() => {
    if (!compId) {
      return;
    }
    const ele = document.getElementById(compId);
    if (!ele) {
      return;
    }
    html2canvas(ele).then(function(canvas) {
      if (canvas) {
        const imageSrc = canvas.toDataURL('png');
        setSrc(imageSrc);
        setFieldsValue({
          imageSrc,
        });
      }
    });
  }, [compId, setSrc, setFieldsValue]);

  return (
    <div style={{ paddingLeft: 10, paddingRight: 10 }}>
      <Form.Item
        label=""
        {...formItemLayout}
        style={{
          display: 'none',
        }}
      >
        {getFieldDecorator('imageSrc', {})(<Input />)}
      </Form.Item>
      <Form.Item label="主题名称" {...formItemLayout}>
        {getFieldDecorator('name', {
          rules: [
            {
              required: true,
              message: '请填写主题名称',
            },
          ],
        })(<Input />)}
      </Form.Item>
      {imageSrc && (
        <div>
          <img
            src={imageSrc}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
            }}
            alt=""
          ></img>
        </div>
      )}
    </div>
  );
};

export default SaveThemeConfig;
