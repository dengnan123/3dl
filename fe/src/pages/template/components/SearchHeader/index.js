import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';

import styles from './index.less';

const type_enum = [
  {
    label: '免费模板',
    value: 'free',
  },
  {
    label: 'VIP模板',
    value: 'vip',
  },
];

function SearchHeader(props) {
  const { type = 'free', setTypeChecked, tags, tagChecked, setTagChecked, onAddClick } = props;

  const onTagClick = useCallback(
    key => {
      if (key === tagChecked) {
        setTagChecked(null);
      } else {
        setTagChecked(key);
      }
    },
    [tagChecked, setTagChecked],
  );

  return (
    <div className={styles.top}>
      {/* 模板类别 */}
      <div className={styles.typeDiv}>
        {type_enum.map(t => {
          const { value } = t;
          return (
            <span
              key={value}
              onClick={() => setTypeChecked(value)}
              className={type === value ? styles.current : null}
            >
              {t.label}
            </span>
          );
        })}
      </div>

      {/* 标签行 */}
      <div className={styles.tagsDiv}>
        <span>标签分类:</span>
        <span className={styles.tagsBox}>
          {tags.map(t => {
            const { value } = t;
            return (
              <span
                key={value}
                onClick={() => onTagClick(value)}
                className={tagChecked === value ? styles.active : null}
              >
                {t.label}
              </span>
            );
          })}
        </span>
      </div>

      <Button className={styles.add} type="primary" onClick={onAddClick}>
        <span className={styles.plus}>+</span> 新建可视化
      </Button>
    </div>
  );
}

SearchHeader.propTypes = {
  tags: PropTypes.array,
  type: PropTypes.string,
  tagChecked: PropTypes.string,
  setTagChecked: PropTypes.func,
  setTypeChecked: PropTypes.func,
  onAddClick: PropTypes.func,
};

export default SearchHeader;
