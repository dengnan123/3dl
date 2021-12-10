import React, { useState, useEffect } from 'react';
import { Icon } from 'antd';
import classnames from 'classnames';
import { isArray } from 'lodash';

import { ONCHANGE_LIST, ONCLICK_LIST, CONTAINER_LIST } from '@/helpers/editEnum';

import styles from './index.less';

const TYPE_LIST = {
  onChange: ONCHANGE_LIST,
  onClick: ONCLICK_LIST,
  container: CONTAINER_LIST,
  moveTop: ONCLICK_LIST,
  moveBottom: ONCLICK_LIST,
};

const EditInteractiveOnChangeList = props => {
  const { onShowModal, data, listType, noSettingDetail } = props;
  const [itemList, setList] = useState([]);
  useEffect(() => {
    if (listType) {
      setList(TYPE_LIST[listType]);
    }
  }, [listType]);

  return (
    <div className={styles.changeContent}>
      {itemList.map(list => {
        const { key, label, openKey, sourceType } = list;
        if (noSettingDetail) {
          return (
            <div
              key={key}
              className={styles.item}
              onClick={() => {
                onShowModal(listType);
              }}
            >
              <p className={styles.title}>{label}</p>
              <div className={styles.icon}>
                <Icon type="edit" />
              </div>
            </div>
          );
        }
        const settingArr = data[key];

        let isSetting = !!settingArr;
        if (sourceType !== 'callback') {
          let hasChooseItems = false;
          if (isArray(settingArr)) {
            hasChooseItems = settingArr && settingArr.length;
          } else if (settingArr && JSON.stringify(settingArr) !== '{}') {
            hasChooseItems = true;
          }
          const isHasCustom = !!(openKey && data[openKey]);
          isSetting = hasChooseItems || isHasCustom;
        }

        return (
          <div
            key={key}
            className={styles.item}
            onClick={() => {
              onShowModal(listType, list);
            }}
          >
            <p className={styles.title}>
              {label}
              <span className={classnames(styles.tips, { [styles.setting]: isSetting })}>
                {isSetting ? '(已设置)' : ''}
              </span>
            </p>
            <div className={styles.icon}>
              <Icon type="edit" />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default EditInteractiveOnChangeList;
