import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { useDebounce } from '@react-hook/debounce';
import API from '@/helpers/api';
import { Radio, Spin, Input, Select, Button, Empty } from 'antd';

import styles from './index.less';

async function fetchPageList({ setPageState, params }) {
  setPageState(state => ({ ...state, pageLoading: true }));
  const res = await API.get(`/page`, { params });
  const pageList = res?.data?.list || [];
  setPageState(state => ({ ...state, pageList, pageLoading: false }));
}

async function fetchTagList({ setTagState }) {
  setTagState(state => ({ ...state, tagLoading: true }));
  const res = await API.get(`/tag`, {
    params: {
      pageSize: 9999,
    },
  });
  const tagList = res?.data || [];
  setTagState(state => ({ ...state, tagList, tagLoading: false }));
}

const typeArr = [
  {
    label: '全部',
    value: 'all',
  },
  {
    label: '我的',
    value: 'my',
  },
];

function ScreenList(props) {
  const { setScreenId, currentUser } = props;
  const [{ pageList, pageLoading }, setPageState] = useState({ pageList: [], pageLoading: false });
  const [{ tagList, tagLoading }, setTagState] = useState({ tagList: [], tagLoading: false });

  const searchRef = useRef(null);
  const [keyword, setKeyword] = useDebounce(undefined, 800);
  const [{ selectTag, selectType }, setFilterState] = useState({});
  const [selectPage, setSelectPage] = useState();

  /**
   * 搜索框
   */
  const onSearchChange = useCallback(e => {
    const value = e.target.value;
    setKeyword(value);
  }, []);

  /** 项目选择 */
  const onTagChange = useCallback(v => {
    setFilterState(state => ({ ...state, selectTag: v }));
  }, []);

  /** 类型选择 */
  const onTypeChange = useCallback(v => {
    setFilterState(state => ({ ...state, selectType: v }));
  }, []);

  /** 重置 */
  const handleReset = useCallback(v => {
    searchRef.current.setValue();
    setFilterState({});
    setKeyword(undefined);
  }, []);

  /** 选择页面 */
  const onChange = useCallback(
    e => {
      const pageId = e.target.value;
      const currentPage = pageList?.find(n => n.id === pageId);
      setScreenId(pageId);
      setSelectPage(currentPage);
    },
    [pageList, setScreenId],
  );

  /** 搜索条件 */
  const params = useMemo(() => {
    const payload = { current: 1, pageSize: 999, keyword };
    if (selectType === 'my') {
      payload.userId = currentUser?.id;
    }
    if (selectTag !== 'all') {
      payload.tagId = selectTag;
    }
    return payload;
  }, [selectType, selectTag, currentUser, keyword]);

  /** 获取tag列表 */
  useEffect(() => {
    fetchTagList({ setTagState });
  }, []);

  /** 获取大屏列表 */
  useEffect(() => {
    fetchPageList({ params, setPageState });
  }, [params]);

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <Input
          ref={searchRef}
          onChange={onSearchChange}
          allowClear={true}
          placeholder="名称，id"
          className={styles.search}
        />

        <span className={styles.selectBox}>
          <Select
            style={{ width: 120 }}
            placeholder="项目"
            allowClear={true}
            value={selectTag}
            onChange={onTagChange}
            className="dm-select-default"
            loading={tagLoading}
          >
            <Select.Option value="all">全部</Select.Option>
            {(tagList || []).map(n => (
              <Select.Option key={n.id} value={n.id}>
                {n.name}
              </Select.Option>
            ))}
          </Select>

          <Select
            style={{ width: 80 }}
            placeholder="类型"
            allowClear={true}
            value={selectType}
            onChange={onTypeChange}
            className="dm-select-default"
          >
            {typeArr.map(n => (
              <Select.Option key={n.value} value={n.value}>
                {n.label}
              </Select.Option>
            ))}
          </Select>

          {(selectTag || selectType || keyword) && (
            <Button type="link" onClick={handleReset}>
              重置
            </Button>
          )}
        </span>

        <div className={styles.selected}>
          已选：
          <span
            title={`${selectPage?.name}(${selectPage?.id})`}
            style={{ color: selectPage ? '#1991eb' : '#999' }}
          >
            {selectPage ? `${selectPage?.name}(${selectPage?.id})` : '--'}
          </span>
        </div>
      </div>
      <Spin spinning={pageLoading}>
        {!pageList.length && !pageLoading && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
        {!!pageList.length && (
          <Radio.Group onChange={onChange}>
            {pageList?.map(v => {
              return (
                <Radio key={v.id} value={v.id}>
                  <span title={`${v.name}(${v.id})`}>
                    {v.name}({v.id})
                  </span>
                </Radio>
              );
            })}
          </Radio.Group>
        )}
      </Spin>
    </div>
  );
}

ScreenList.propTypes = {
  setScreenId: PropTypes.func,
  currentUser: PropTypes.object,
};

export default ScreenList;
