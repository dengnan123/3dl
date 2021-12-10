import React from 'react';
import { Drawer } from 'antd';

export default props => {
  const { children } = props;
  return <Drawer {...props}>{children}</Drawer>;
};
