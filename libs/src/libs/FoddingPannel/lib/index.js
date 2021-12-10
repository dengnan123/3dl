import React, { useState } from 'react';
import styles from './index.less';

function FoddingPannel(props) {
  const { style, data = [], onChange } = props;
  const {
    childrenBgColor = '#0E101A',
    FatherHeight = 50,
    childrenHeight = 40,
    MarginTop = 5,
    FaMarginTop = 5,
    FatherBgColor = '#0E101A',
    highlightColor = '#429EFF',
    itemRadius = 16,
    ChildrenFontSize = 16,
    FaFontSize = 16,
    FontColor = '#e6e6e6',
  } = style;
  const [currentItem, setCurrentItem] = useState('');
  const [currentChildrenItem, setCurrentChildrenItem] = useState('');
  const { dataSource } = data;
  const clickItem = d => {
    setCurrentChildrenItem(d.id);
    onChange && onChange(d);
  };

  const setCurrent = id => {
    setCurrentChildrenItem(null);
    if (id === currentItem) {
      setCurrentItem(null);
    } else {
      setCurrentItem(id);
    }
  };
  return (
    <div style={{ width: '100%', height: '100%', overflowY: 'scroll' }}>
      <ul className={styles.main}>
        {dataSource.map(({ title, id, children }) => (
          <li
            className={styles.item}
            style={{
              marginTop: FaMarginTop + 'px',
              color: FontColor,
              borderRadius: itemRadius + 'px',
            }}
            key={id}
          >
            <div
              className={styles.bar}
              onClick={() => {
                setCurrent(id);
              }}
              style={{
                height: FatherHeight,
                backgroundColor: FatherBgColor,
                borderRadius: itemRadius + 'px',
              }}
            >
              <span className={styles.title} style={{ fontSize: FaFontSize }}>
                {title}
              </span>
              <span className={styles.tangle}></span>
            </div>
            <ul
              className={styles.childrenWrapper}
              style={{
                height:
                  currentItem === id
                    ? children.length * (parseInt(childrenHeight) + parseInt(MarginTop)) + 'px'
                    : 0,
              }}
            >
              {children.map(d => (
                <li
                  onClick={() => {
                    clickItem(d);
                  }}
                  className={styles.childrenItem}
                  key={d.id}
                  style={{
                    backgroundColor:
                      currentChildrenItem === d.id ? highlightColor : childrenBgColor,
                    marginTop: MarginTop + 'px',
                    fontSize: ChildrenFontSize,
                    height: childrenHeight,
                    lineHeight: childrenHeight + 'px',
                    borderRadius: itemRadius + 'px',
                  }}
                >
                  {d.title}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FoddingPannel;
