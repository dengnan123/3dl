import React from 'react';
import router from 'umi/router';

import { TYPE_LIST } from './util';

import styles from './index.less';

function StaticPage(props) {
  const total = TYPE_LIST.length;

  const onItemClick = item => {
    const { path } = item;
    router.push(path);
  };

  return (
    <section className={styles.staticContent}>
      <div className={styles.topContainer}>
        <div className={styles.topTotal}>
          共 <i>{total}</i> 个模块
        </div>
      </div>
      <div className={styles.list}>
        {TYPE_LIST.map(item => {
          const { key, label, description } = item;
          return (
            <div key={key} className={styles.itemWrap} onClick={() => onItemClick(item)}>
              <div className={styles.item}>
                <div className={styles.title}>
                  <h3>{label}</h3>
                </div>
                <p className={styles.permsRemark}>{description || '--'}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

StaticPage.propTypes = {};

export default StaticPage;
