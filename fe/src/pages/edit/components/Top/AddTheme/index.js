import React, { useState, Fragment, useEffect } from 'react';
import HoverList from '@/components/HoverList';
import { Button, Form, Input, Icon } from 'antd';
// import ReactColor from '@/components/ReactColor';
import styles from './index.less';
import InputColor from '@/components/InputColor';
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 18 },
};
const FormItem = Form.Item;
export default ({ form: { getFieldDecorator }, themeInfo }) => {
  const [data, setData] = useState([]);
  useEffect(() => {
    setData(themeInfo.colors || []);
  }, [themeInfo.colors]);
  const addColor = () => {
    setData(v => {
      return [...v, '#ffffff'];
    });
  };
  const deleteClick = value => {
    const arr = data.filter((v, index) => index !== value);
    setData(arr);
  };
  const hoverListProps = {
    list: data,
    renderContent({ v, nowHover, index, hoverIndex }) {
      return (
        <div className={styles.content}>
          <FormItem label={`颜色${index + 1}`} {...formItemLayout}>
            {getFieldDecorator(`color${index}`, {
              initialValue: v,
            })(<InputColor />)}
          </FormItem>
          <span className={styles.icon}>
            {hoverIndex === index && (
              <span>
                <Icon
                  type="delete"
                  onClick={() => {
                    deleteClick(hoverIndex);
                  }}
                />
              </span>
            )}
          </span>
        </div>
      );
    },
  };
  return (
    <Fragment>
      <FormItem label="主题名称" {...formItemLayout}>
        {getFieldDecorator(`name`, {
          initialValue: themeInfo.name,
        })(<Input />)}
      </FormItem>
      <HoverList {...hoverListProps}></HoverList>

      <Button type="primary" onClick={addColor}>
        新增颜色
      </Button>
    </Fragment>
  );
};
