import React, { useState } from 'react';
import { Radio } from 'antd';
import ModalWrapFooter from '@/components/ModalWrapFooter';

const Container = ({ initUseCompList, isSelectCompInfo, onCancel, saveContainerDeps }) => {
  const [value, setValue] = useState();
  const wrapProps = {
    onCancel,
    onOk() {
      saveContainerDeps({
        id: isSelectCompInfo.id,
        data: {
          containerDeps: [value],
        },
      });
      onCancel();
    },
  };
  return (
    <ModalWrapFooter {...wrapProps}>
      <Radio.Group
        onChange={e => {
          setValue(e.target.value);
        }}
        value={value}
      >
        {initUseCompList
          .filter(v => {
            return v.id !== isSelectCompInfo.id && v.type === 'container';
          })
          .map(v => {
            return <Radio value={v.id}>{v.aliasName ? v.aliasName : v.compName}</Radio>;
          })}
      </Radio.Group>
    </ModalWrapFooter>
  );
};

export default Container;
