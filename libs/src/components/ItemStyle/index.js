import React, { useState } from 'react';
import { Tooltip, Collapse, InputNumber, Select } from 'antd';
import styles from './index.less';

function ItemStyle(props) {
  const { name, stylesname, direction } = props;
  const [number, setNumber] = useState(0);
  const [util, setUtil] = useState('px');

  const tooptip = (name, stylesname, direction) => {
    return (
      <Tooltip placement={direction || 'bottom'} title={stylesname}>
        <span>{name}</span>
      </Tooltip>
    );
  };

  return (
    <div className={styles.item}>
      <div className={styles.itemCol}>
        <InputNumber
          defaultValue={0}
          onChange={e => {
            setNumber(e);
          }}
          className={styles.itemNumber}
        />
        <Select
          defaultValue="px"
          onChange={b => {
            setUtil(b);
          }}
          className={styles.itemSelect}
        >
          <Select.Option value="px">px</Select.Option>
          <Select.Option value="em">em</Select.Option>
          <Select.Option value="rem">rem</Select.Option>
        </Select>
      </div>
      <p style={{ textAlign: 'center' }}>{tooptip(name, stylesname, direction)}</p>
    </div>
  );
}

export default ItemStyle;
