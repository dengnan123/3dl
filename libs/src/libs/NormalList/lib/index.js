import React from 'react';
import styles from './index.less';

function NormalList(props) {
  const { data, onChange, otherCompParams, style } = props;
  const { width = 380, height = 40, fontSize = 14 } = style || {};

  const _onSelectChange = data => {
    console.log('_onSelectChange is --》', data);
    onChange &&
      onChange({
        includeEvents: ['passParams'],
        formParams: { ...otherCompParams, selectData: data },
      });
  };
  return (
    <ul style={{width, maxHeight: `${Number(height) * 5}px`}} className={styles.container}>
      {Array.isArray(data) &&
        data.map(item => {
          return (
            <li style={{ width, fontSize,height, lineHeight: `${height}px` }} key={item.id} onClick={() => _onSelectChange(item)}>
              {item.userName}
            </li>
          );
        })}
    </ul>
  );
}

export default NormalList;
