import React, { useState, Fragment } from 'react';
// import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Button, Divider } from 'antd';
import uuid from 'uuid';
import { getParseSearch } from '../../../../../helpers/utils';
import { API_HOST } from '../../../../../config';
import styles from './index.less';
import Img from '../../../../../components/Img';
// import comp from '../../../../../components';

export default props => {
  const { compList, setUseCompList, useCompList, addCompToPage } = props;
  const { pageId } = getParseSearch();
  const [hoverID, setHoverID] = useState(null);

  const sortCompList = useCompList.sort(function(a, b) {
    return b.zIndex - a.zIndex;
  });
  const onClick = compId => {
    let maxIndex;
    if (!sortCompList.length) {
      maxIndex = 1;
    } else {
      maxIndex = sortCompList[0].zIndex;
    }
    const selectInfo = compList.filter(v => v.compId === compId)[0];
    const newInfo = {
      ...selectInfo,
      zIndex: maxIndex + 1,
      id: uuid.v4(),
      isSelect: false,
    };
    const arr = [...useCompList, newInfo];

    setUseCompList(arr);

    const data = {
      ...newInfo,
      pageId,
    };
    addCompToPage(data);
  };

  const showLayerHover = compId => {
    setHoverID(compId);
  };
  const hiddenLayerHover = () => {
    setHoverID(null);
  };

  return (
    <div
      className={styles.leftDiv}
      style={{
        height: window.innerHeight - 80 - 45,
      }}
    >
      {compList.map(v => {
        const { compId, compName } = v;
        // const TtemComp = comp[compName];
        // const itemCompProps = {
        //   height: '100%',
        //   width: 80,
        // };
        return (
          <Fragment>
            <div
              key={compId}
              className={classnames(compId === hoverID ? styles.hoverItemaDiv : styles.itemDiv)}
              onMouseEnter={() => {
                showLayerHover(compId);
              }}
              onMouseLeave={() => {
                hiddenLayerHover();
              }}
            >
              <Img className={styles.imgDiv} url={`${API_HOST}/static/pic/${compName}.png`}></Img>

              {/* <span>{compName}</span> */}

              <Button
                type="primary"
                size="small"
                onClick={() => {
                  console.log('compIdcompId', compId);
                  onClick(compId);
                }}
                className={hoverID === compId ? styles.showAddBtn : styles.addBtn}
              >
                添加
              </Button>
            </div>
            <Divider></Divider>
          </Fragment>
        );
      })}
    </div>
  );
};
