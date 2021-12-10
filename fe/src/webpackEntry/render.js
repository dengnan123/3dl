import React, { useEffect } from 'react';
import Preview from '@/components/Preview';
import { windowUtil } from '@/helpers/windowUtil';
import { destoryGlobalSpinner } from '@/helpers/view';
import '../../node_modules/antd/dist/antd.min.css';
windowUtil();
export default props => {
  useEffect(() => {
    destoryGlobalSpinner();
  }, []);
  return <Preview {...props}></Preview>;
};
