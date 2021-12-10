import React from 'react';
import PropTypes from 'prop-types';
import { Card } from 'antd';
import { staticPath } from '@/config';
import defPic from '@/assets/no-pic.png';
import { GridList } from '@/components/index';

import styles from './index.less';

const colSpan = {
  xs: { span: 24 },
  sm: { span: 24 },
  md: { span: 12 },
  lg: { span: 6 },
  xl: { span: 6 },
  xxl: { span: 4 },
};

function ContentWrap(props) {
  const { list, itemClick, listLoading } = props;

  return (
    <div className={styles.contentWrap}>
      <GridList
        loading={listLoading}
        colProps={colSpan}
        rowProps={{ gutter: [30, 30] }}
        dataSource={list}
        renderItem={n => {
          const { id, name, pageWidth, pageHeight, pageCoverImg } = n;
          const src = pageCoverImg ? `${staticPath}/${id}/${pageCoverImg}` : defPic;
          return (
            <Card
              className={styles.card}
              cover={
                <div
                  className={styles.corverImg}
                  onClick={() => {
                    itemClick(id, n);
                  }}
                >
                  <div className={styles.view} style={{ backgroundImage: `url(${src})` }}></div>
                </div>
              }
              hoverable={true}
            >
              <div className={styles.title} title={`${name}/${pageWidth}-${pageHeight}`}>
                <span>{name}</span>
                <span style={{ margin: '0 5px' }}>/</span>
                <span>{`${pageWidth}-${pageHeight}`}</span>
              </div>
            </Card>
          );
        }}
      />
    </div>
  );
}

ContentWrap.propTypes = {
  listLoading: PropTypes.bool,
  total: PropTypes.number,
  list: PropTypes.array,
  itemClick: PropTypes.func,
};

export default ContentWrap;
