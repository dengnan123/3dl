import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Progress } from 'antd';
import buildingImage from '../../../assets/building-image.png';

import styles from './index.less';
function DataDrivenScrollCard(props) {
  const { style = {}, data = {}, onChange, lang = 'zh-CN' } = props;

  const { value = [] } = data;

  function formatNum(num, local) {
    if (typeof num !== 'number') {
      num = Number(num);
    }
    const site = {
      in: 'en-IN',
      id: 'id-ID',
      us: 'en-US',
      uk: 'en-GB',
      es: 'es-ES',
      fr: 'fr-FR',
      it: 'it-IT',
      ru: 'ru-RU',
      hk: 'zh-HK',
      tw: 'zh-TW',
    };
    let name = site[local] || 'en-GB';
    return num.toLocaleString(name);
  }

  const onItemClick = (item, e) => {
    // const actualClickedItem = Object.keys(item).filter(i => i === e.target.dataset.name);
    // if (actualClickedItem.length === 1) {
    //   item.clickedItem = { [actualClickedItem[0]]: item[actualClickedItem[0]] };
    // }

    // console.log('clicked: ', item);
    e.preventDefault();
    e.stopPropagation();
    onChange && onChange({ item });
  };

  const renderCard = (item, index) => {
    const { title, state, name, tel, orders, undo, src } = item;
    return (
      <div
        key={`${title}-${index}`}
        className={styles.card}
        onMouseUp={e => onItemClick(item, e)}
        onTouchEnd={e => onItemClick(item, e)}
      >
        <img data-name={'src'} src={src ? src : buildingImage} alt={title} />
        <main className={styles.rightContent}>
          <div data-name="title" className={styles.cardTitle}>{`${title}`}</div>
          <div className={styles.cardContent}>
            <div data-name="orders">{`工单数量(单): ${formatNum(orders, lang)}`}</div>
            <div data-name="undo">
              {`待处理: `}
              <Progress
                className={styles.progress}
                showInfo={false}
                strokeColor="#65d2ff"
                percent={Math.floor(undo / orders)}
                strokeWidth={18}
                size="small"
              />
            </div>
            <div data-name="name">{`物业公司: ${name}`}</div>
            <div data-name="tel">{`物业公司电话(单): ${tel}`}</div>
          </div>
        </main>
        <span className={styles.percent} style={{ color: '#65d2ff' }}>
          {Math.floor(undo / orders)}%
        </span>
        <div
          data-name="state"
          className={classnames(state ? styles.normalState : styles.abnormalState, styles.state)}
        >
          {state ? `正常` : `异常`}
        </div>
      </div>
    );
  };

  const renderCardList = value => {
    return value.map((item, index) => renderCard(item, index));
  };

  return <div className={styles.container}>{renderCardList(value)}</div>;
}

DataDrivenScrollCard.propTypes = {
  style: PropTypes.object,
  data: PropTypes.object,
  onChange: PropTypes.func,
};

export default DataDrivenScrollCard;
