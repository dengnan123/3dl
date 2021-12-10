import { Input, Select } from 'antd';
import React from 'react';
// import * as uuid from 'uuid';
import HoverList from '@/components/HoverList';
import styles from './index.less';
import { isArray } from 'lodash';

const { Option } = Select;

const getValueById = (id, value) => {
  for (const v of value) {
    if (v.envId === id) {
      return v;
    }
  }
};
const dv = v => {
  if (!isArray(v)) {
    return [];
  }
  return v;
};
export default ({ onChange, value: initValue, envList = [], type, datasourceList }) => {
  const value = dv(initValue);
  const newValue = envList.map(v => {
    const data = getValueById(v?.id, value);
    return {
      envId: v.id,
      value: data?.value,
      name: v.name,
    };
  });
  const valueChange = (changeValue, v) => {
    const newArr = newValue.map(item => {
      if (v.envId === item.envId) {
        return {
          ...item,
          value: changeValue,
        };
      }
      return item;
    });
    onChange(newArr);
  };

  const nowCheckedEnvId = envList.filter(v => v.checked).map(v => v.id)[0];

  const inputRender = v => {
    if (type === 'database') {
      return (
        <Select
          className={styles.sel}
          onChange={value => {
            valueChange(value, v);
          }}
          value={v.value}
        >
          {datasourceList.map(v => {
            return (
              <Option key={v.id} value={v.id}>
                {v.name}
              </Option>
            );
          })}
        </Select>
      );
    }
    return (
      <Input
        onChange={e => {
          valueChange(e.target.value, v);
        }}
        value={v.value}
      />
    );
  };

  const hoverListProps = {
    list: newValue,
    renderContent({ v, nowHover, index, hoverIndex }) {
      return (
        <div className={styles.warpDiv}>
          <div>
            <span>
              {v.name}
              {nowCheckedEnvId === (v.envId || v.id) && <span> ----- 使用中</span>}
            </span>
          </div>
          <div className={styles.inputDiv}>{inputRender(v)}</div>
        </div>
      );
    },
  };

  return (
    <div>
      <HoverList {...hoverListProps}></HoverList>
    </div>
  );
};
