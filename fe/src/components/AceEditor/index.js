import React, { useState, useEffect } from 'react';
import { Button, notification, Tooltip } from 'antd';
import screenfull from 'screenfull';
import styles from './index.less';
import { copyToClip } from '@/helpers/utils';
// import { getTagColors } from '@/helpers/tag';
import uuid from 'uuid';
// import ace from 'ace-builds';
import AceEditor from 'react-ace';
import { validateFunc, dealWithCodeByLanguage } from './util';
import 'ace-builds/src-noconflict/theme-github';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/webpack-resolver';

const name = `UNIQUE_ID_OF_DIV${uuid.v4()}`;
const id = `${uuid.v4()}`;
// const tagColors = getTagColors();
const defFiledArr = [
  {
    key: 'data',
    des: '组件关联的数据源数据',
  },
  {
    key: 'otherCompParams',
    des: '其他组件传参过来的数据',
  },
  { key: 'basicStyle', des: '组件基础样式' },
  { key: 'style', des: '组件配置' },
];

const defaultWidth = '100%';
const defaultHeight = 700;

export default React.forwardRef((props, ref) => {
  const {
    language = 'javascript',
    theme = 'github',
    value: code,
    disCode,
    update,
    onChange: propsChange,
    showFooter = true,
    showTitle = true,
    titleFiledArr = defFiledArr,
    noCheck,
    showFullScreen = true,
    width: propsWidth,
    height: propsHeight,
  } = props;

  const [selfCode, setCode] = useState(code);
  const [{ height, width }, setHeightAndWidth] = useState({
    height: defaultHeight,
    width: defaultWidth,
  });

  useEffect(() => {
    setHeightAndWidth({
      height: propsHeight || defaultHeight,
      width: propsWidth || defaultWidth,
    });
  }, [propsWidth, propsHeight]);
  function onChange(v) {
    if (disCode) {
      return;
    }
    setCode(v);
    propsChange && propsChange(v);
  }

  const btnClick = () => {
    if (noCheck) {
      update && update(selfCode);
      propsChange && propsChange(selfCode);
      return;
    }
    const validateMsg = validateFunc(language, selfCode);
    if (validateMsg) {
      notification.open({
        message: 'Error',
        description: JSON.stringify(validateMsg),
      });
      return;
    }
    const data = dealWithCodeByLanguage(language, selfCode);
    update && update(data);
    propsChange && propsChange(data);
  };

  const getreqfullscreen = () => {
    const ele = document.getElementById(id);
    setHeightAndWidth({
      height: '100vh',
      width: '100vw',
    });
    if (ele) {
      if (screenfull.isEnabled) {
        screenfull.request(ele);
        screenfull.on('change', () => {
          if (!screenfull.isFullscreen) {
            setHeightAndWidth({
              height: props.height || defaultHeight,
              width: props.width || defaultWidth,
            });
          }
        });
      }
    }
  };
  const getSubmitBtn = () => {
    if (!showFooter) {
      return null;
    }
    if (disCode) {
      return null;
    }
    return (
      <Button onClick={btnClick} type="primary">
        提交
      </Button>
    );
  };
  const getTitle = () => {
    if (!showTitle || !titleFiledArr.length) {
      return null;
    }
    return (
      <div>
        <div className={styles.title}>
          函数参数:
          {titleFiledArr.map((v, i) => {
            return (
              <Tooltip placement="top" title={v.des} key={uuid.v4()}>
                <Button
                  onClick={() => {
                    copyToClip(v.key);
                  }}
                  type="link"
                >
                  {v.key}
                </Button>
              </Tooltip>
            );
          })}
        </div>
      </div>
    );
  };
  return (
    <div id={id}>
      {/* {getCodeHasFuncNames()} */}
      {getTitle()}
      <AceEditor
        mode={language}
        theme={theme}
        onChange={onChange}
        width={width}
        height={height}
        name={name}
        value={selfCode}
        setOptions={{ useWorker: false }}
        editorProps={{ $blockScrolling: true }}
      />

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '10px',
        }}
      >
        {showFullScreen && <Button onClick={getreqfullscreen}>全屏</Button>}
        {getSubmitBtn()}
      </div>
    </div>
  );
});
