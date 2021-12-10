import { useState, useCallback, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { Drawer, Button, Collapse, Select, Tooltip } from 'antd';
import { windowUtilList } from '@/helpers/windowUtil';
import { copyToClip } from '@/helpers/utils';
import styles from './index.less';
import { useDoApi } from '@/hooks/apiHost';
import { add, update, del, findList } from '@/service/customFunc';
import { getParseSearch } from '@/helpers/utils';
import AddCustomFunc from '@/components/AddCustomFunc';

const CustomFunc = ({ tagId: pTagId,type }) => {
  const { tagId, pageId } = getParseSearch();
  const addCustomFuncProps = {
    tagId: tagId || pTagId,
    pageId,
    type
  };
  return (
    <div>
      <AddCustomFunc {...addCustomFuncProps}></AddCustomFunc>
    </div>
  );
};

export default CustomFunc;
