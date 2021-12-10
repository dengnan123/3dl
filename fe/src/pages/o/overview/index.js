import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import { OverviewHeader, OverviewContent, OverviewList } from './components/index';

import styles from './index.less';

function Overview(props) {
  const { getTagList, getPageList, locationQuery, tagList, pageList, pageListLoading } = props;

  // 选中的tag
  const [selectPage, setSelectPage] = useState();
  // 选中页面
  const [selectTag, setSelectTag] = useState();

  // 初始化数据
  useEffect(() => {
    const { tagId, pageId } = locationQuery;
    let currentTag = {};
    let currentPage = {};
    getTagList({ pageSize: 999 }).then(data => {
      const filalTagId = parseInt(tagId) || data[0]?.id;

      if (filalTagId) {
        currentTag = data?.find(n => n.id === filalTagId);
      }
      if (!currentTag) {
        setSelectTag();
        setSelectPage();
        return;
      }
      setSelectTag(currentTag);
      getPageList({ tagId: currentTag.id, pageSize: 999, current: 1 }).then(data => {
        const filalPageId = parseInt(pageId) || data[0]?.id;

        if (filalTagId) {
          currentPage = data?.find(n => n.id === filalPageId);
        }

        setSelectPage(currentPage);
      });
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onTagSelectChange = useCallback(
    tagId => {
      const currentTag = tagList?.find(n => n.id === tagId);
      setSelectTag(currentTag);
      getPageList({ tagId, pageSize: 999, current: 1 });
    },
    [getPageList, tagList],
  );

  const onListClick = useCallback(currentPage => {
    const url = `/o/overview?pageId=${currentPage.id}&tagId=${currentPage.tagId}`;
    setSelectPage(currentPage);
    window.history.pushState('', '', url);
  }, []);

  return (
    <div className={styles.layout}>
      <OverviewHeader />

      <section className={styles.content}>
        <div className={styles.left}>
          <OverviewContent
            data={selectPage}
            selectTag={selectTag}
            tagList={tagList}
            pageList={pageList}
            pageListLoading={pageListLoading}
            setSelectPage={onListClick}
            onTagSelectChange={onTagSelectChange}
          />
        </div>

        <div className={styles.sider}>
          <OverviewList
            selectTag={selectTag}
            tagList={tagList}
            dataSource={pageList}
            loading={pageListLoading}
            onListClick={onListClick}
            onTagSelectChange={onTagSelectChange}
          />
        </div>
      </section>
    </div>
  );
}

Overview.propTypes = {
  getTagList: PropTypes.func,
  getPageList: PropTypes.func,
};

const mapStateToProps = ({ overview, loading, app }) => {
  return {
    locationQuery: app.locationQuery,
    pageList: overview.pageList,
    tagList: overview.tagList,
    pageListLoading: loading.effects['overview/getPageList'],
    tagListLoading: loading.effects['overview/getTagList'],
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getPageList: payload =>
      dispatch({
        type: 'overview/getPageList',
        payload,
      }),
    getTagList: payload =>
      dispatch({
        type: 'overview/getTagList',
        payload,
      }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Overview);
