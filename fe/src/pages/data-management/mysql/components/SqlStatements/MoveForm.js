import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, Radio } from 'antd';

import styles from './index.less';

function MoveFormContent(props) {
  const { list = [], currentItem, form } = props;
  const { getFieldDecorator } = form;
  const { id, name } = currentItem || {};
  const [moveList, setMoveList] = useState([]);

  useEffect(() => {
    if (!id) {
      setMoveList(list);
      return;
    }
    const newList = list.filter(i => i.id !== id);
    setMoveList(newList);
  }, [list, id]);

  return (
    <div className={styles.contentWrapper}>
      <p>
        <span>当前数据库:</span>
        <span>{name}</span>
      </p>
      <Form className={styles.formMain}>
        <Form.Item label={''}>
          {getFieldDecorator('changeId', {
            rules: [
              {
                required: true,
                message: '请选择要移动的数据库',
              },
            ],
            initialValue: null,
          })(
            <Radio.Group>
              {moveList.map(i => {
                return (
                  <Radio key={i.id} value={i.id}>
                    {i.name}
                  </Radio>
                );
              })}
            </Radio.Group>,
          )}
        </Form.Item>
      </Form>
    </div>
  );
}

MoveFormContent.propTypes = {
  form: PropTypes.object,
  list: PropTypes.array,
  currentItem: PropTypes.object,
};

export default MoveFormContent;
