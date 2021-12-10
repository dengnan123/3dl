import React, { useMemo, useState, useCallback } from 'react';
import classnames from 'classnames';
import { Collapse, Button } from 'antd';
import { compList } from '@/helpers/comp';
import styles from './index.less';

const { Panel } = Collapse;
export default ({ itemClick, isDefaultExpanAll, activeClassName, defaultActiveBtnKey }) => {
  const [activeBtnKey, setActiveBtnKey] = useState(defaultActiveBtnKey);

  const defaultActiveKey = useMemo(() => {
    let keys = [];
    if (!isDefaultExpanAll) {
      return keys;
    }

    keys = compList.map(item => item.key);
    return keys;
  }, [isDefaultExpanAll]);

  const _onClick = useCallback(
    key => {
      setActiveBtnKey(key);
      itemClick && itemClick(key);
    },
    [itemClick],
  );

  return (
    <Collapse bordered={false} defaultActiveKey={defaultActiveKey}>
      {compList.map(v => {
        const { label, key, child } = v;
        return (
          <Panel header={label} key={key}>
            <div className={styles.content}>
              {child.map(v => {
                return (
                  <Button
                    key={v.compName + v.label}
                    type="link"
                    className={classnames(styles.btn, {
                      [activeClassName]: activeClassName && v.compName === activeBtnKey,
                    })}
                    onClick={() => {
                      _onClick(v.compName);
                    }}
                  >
                    {v.label}
                  </Button>
                );
              })}
            </div>
          </Panel>
        );
      })}
    </Collapse>
  );
};
