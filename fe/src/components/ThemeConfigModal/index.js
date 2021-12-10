import React, { useRef, useCallback, useState, useEffect } from 'react';
import { useDebounce } from 'react-use';
import { Spin, Card, Icon, Empty, Input } from 'antd';

import styles from './index.less';

const { Search } = Input;

export default ({ data, fetchLoading, goBackClick, confirmClick, itemClick, confirmLoading }) => {
  const [activeInfo, setActiveInfo] = useState(null);
  const [keyword, setKeyword] = useState();
  const [dataSource, setDataSource] = useState(data || []);
  const nowClickRef = useRef();

  const type = data?.[0]?.type;

  const _confirmClick = useCallback(
    themeInfo => {
      confirmClick(themeInfo);
      setActiveInfo(themeInfo);
      nowClickRef.current = themeInfo;
    },
    [confirmClick],
  );

  useEffect(() => {
    setActiveInfo(null);
    setKeyword(undefined);
  }, [type]);

  useDebounce(
    () => {
      const d =
        data?.filter(n =>
          `${n?.type}${n?.name}${n?.themeType}`.toLocaleLowerCase().includes(keyword ?? ''),
        ) || [];
      setDataSource(d);
    },
    800,
    [data, keyword],
  );

  return (
    <section className={styles.section}>
      <div className={styles.top}>
        <Search
          placeholder="名称，组件名，主题类型"
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          allowClear={true}
        />
      </div>
      <div className={styles.center}>
        <Spin spinning={Boolean(fetchLoading)}>
          {!!dataSource?.length ? (
            <ul className={styles.list}>
              {dataSource?.map((v, i) => {
                const isActive = activeInfo?.id === v?.id;
                return (
                  <li
                    key={i}
                    onClick={() => {
                      itemClick(v);
                      nowClickRef.current = v;
                      setActiveInfo(v);
                    }}
                    className={isActive ? styles.active : null}
                  >
                    <Card
                      title={v.name}
                      bordered={false}
                      className={styles.card}
                      hoverable={true}
                      extra={<Check onCheck={() => _confirmClick(v)} />}
                    >
                      <img
                        style={{
                          maxWidth: '230px',
                          maxHeight: '230px',
                        }}
                        title=""
                        alt=""
                        src={v.imageSrc}
                      />
                    </Card>
                  </li>
                );
              })}
            </ul>
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
          )}
        </Spin>
      </div>
    </section>
  );
};

function Check(props) {
  const { onCheck } = props;
  const [checking, setChecking] = useState(false);
  const timerRef = useRef(null);

  const handleCheck = useCallback(() => {
    setChecking(true);
    onCheck && onCheck();

    timerRef.current && clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setChecking(false);
    }, 2000);
  }, [onCheck]);

  return checking ? (
    <span style={{ fontSize: '14px' }}>使用成功</span>
  ) : (
    <Icon type="check" onClick={handleCheck} />
  );
}
