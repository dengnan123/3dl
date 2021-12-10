import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { API_HOST } from '../../../../../config';
import { Card, Select } from 'antd';
import { GridList } from '../../../../../components/index';
import defPic from '../../../../../assets/no-pic.png';

import styles from './index.less';

function OverviewList(props) {
  const { dataSource, tagList, loading, onListClick, onTagSelectChange, selectTag } = props;

  const renderItem = useCallback(
    (item, index) => {
      const { id, name, pageWidth, pageHeight, pageCoverImg, tagId } = item;
      const src = pageCoverImg ? `${API_HOST}/static/page/${id}/${pageCoverImg}` : defPic;
      return (
        <Card
          className={styles.card}
          bordered={false}
          cover={
            <div className={styles.corverImg}>
              <div className={styles.view} style={{ backgroundImage: `url(${src})` }}></div>
            </div>
          }
          hoverable={true}
          onClick={() => onListClick(item)}
        >
          <h4>{name}</h4>
          <div className={styles.description}>
            {pageWidth} × {pageHeight} / {id} / {tagId}
          </div>
        </Card>
      );
    },
    [onListClick],
  );

  return (
    <div className={styles.container}>
      <Select
        className={classnames(styles.select, 'dm-select-default')}
        placeholder="选择项目"
        value={selectTag?.id}
        onChange={onTagSelectChange}
        getPopupContainer={trigger => trigger}
      >
        {tagList?.map(n => {
          return (
            <Select.Option key={n.id} value={n.id}>
              {n.name}
            </Select.Option>
          );
        })}
      </Select>
      <GridList
        loading={loading}
        dataSource={dataSource}
        renderItem={renderItem}
        colProps={{
          xs: { span: 24 },
          sm: { span: 24 },
          md: { span: 24 },
          lg: { span: 24 },
          xl: { span: 24 },
          xxl: { span: 24 },
        }}
      />
    </div>
  );
}

OverviewList.propTypes = {
  onListClick: PropTypes.func,
  dataSource: PropTypes.array,
  tagList: PropTypes.array,
  loading: PropTypes.bool,
};

export default OverviewList;
