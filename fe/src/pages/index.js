import React from 'react';
import { Redirect } from 'dva/router';
import 'antd/dist/antd.less';
export default function() {
  return (
    <Redirect
      to={{
        pathname: '/template',
      }}
    />
  );
}
