import React from 'react';
import { notification } from 'antd';
import { transformCode, getCodeFuncNames, compileModalCode } from '@/helpers/screen';
import AceEditor from '@/components/AceEditor';
export default props => {
  const { field, update, language, noCheck } = props;
  const es5CodeKey = `${field}Es5Code`;
  const codeFuncNames = `${field}HasNames`;
  const editProps = {
    ...props,
    update: v => {
      if (!v) {
        update({
          [field]: null,
          [es5CodeKey]: null,
        });
        return;
      }
      const newV = v.replace(/\s*/g, '');
      if (!newV) {
        update({
          [field]: null,
          [es5CodeKey]: null,
        });
        return;
      }
      if (language === 'json') {
        return v;
      }
      const updateData = {
        [field]: v,
      };
      let code;
      try {
        if (noCheck) {
          code = compileModalCode(v);
        } else {
          code = transformCode(v);
        }
      } catch (error) {
        notification.open({
          message: 'Error',
          description: '格式有误',
        });
        return;
      }
      updateData[es5CodeKey] = code;
      updateData[codeFuncNames] = getCodeFuncNames();
      update(updateData);
    },
  };
  return <AceEditor {...editProps}></AceEditor>;
};
