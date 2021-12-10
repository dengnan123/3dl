import { useCallback } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { getNameByLang } from '../../../helpers/lang';
import { Card, Icon, Popover, List } from 'antd';
import styles from './index.less';

function CustomizeCard(props) {
  const {
    style: {
      cardBgColor = '#ffffff',
      showTitle = false,
      title = '我是标题',
      titleEn = 'I am title',
      headHeight = 51,
      headPadding = 30,
      headFontSize = 16,
      headFontWeight = 600,
      headFontColor = '#454458',
      titleTextAlign = 'left',
      showMore = false,
      moreBtnWidth = 20,
      moreBtnHeight = 20,
      moreBtnRadius = 4,
      moreBtnBorderWidth = 1,
      moreBtnBorderColor = '#F0F1F5',
      moreBtnBgColor = '#f3f3fb',
      popoverPosition = 'bottom',
      popoverContentList = [],
      showBorder = false,
      cardBorderColor = '#F0F1F5',
      borderRadius = 0,
      showBar = true,
      barWidth = 8,
      barColor = '#71daa5',
      showBoxShadow = true,
      hShadow = 1,
      vShadow = 1,
      blur = 10,
      spread = 0,
      shadowColor = '#d9dcdf',
      cardId = '',
    },
    lang = 'en-US',
    onChange,
  } = props;

  const onItemClick = useCallback(
    item => {
      const { compKey, compValue } = item;
      console.log('clicked: ', { [compKey]: compValue });
      onChange && onChange({ [compKey]: compValue });
    },
    [onChange],
  );

  const renderExtraPopoverContent = (
    <List className={styles.list}>
      {popoverContentList.map((item, index) => (
        <List.Item key={index} onClick={() => onItemClick(item)}>
          {getNameByLang(lang, item.label, item.labelEn)}
        </List.Item>
      ))}
    </List>
  );

  const renderExtra = (
    <Popover
      placement={popoverPosition}
      title=""
      content={renderExtraPopoverContent}
      trigger="click"
    >
      <div
        className={styles.extra}
        style={{
          width: moreBtnWidth,
          height: moreBtnHeight,
          backgroundColor: moreBtnBgColor,
          fontSize: `${moreBtnHeight - 4}px`,
          border: `solid ${moreBtnBorderWidth}px ${moreBtnBorderColor}`,
          borderRadius: moreBtnRadius,
        }}
      >
        <Icon type="ellipsis" />
      </div>
    </Popover>
  );

  const cardProps = {
    className: classnames(styles.card, {
      [styles.cardWidthHeadBorder]: !showBorder,
      [styles.cardWidthoutHeadBorder]: !showTitle,
    }),
    title: showTitle ? getNameByLang(lang, title, titleEn) : '',
    headStyle: {
      height: headHeight,
      fontSize: `${headFontSize}px`,
      fontWeight: headFontWeight,
      color: headFontColor,
      textAlign: titleTextAlign,
      padding: `0 ${headPadding}px`,
    },
    bordered: showBorder,
    extra: showMore ? renderExtra : null,
    style: { backgroundColor: cardBgColor, borderRadius },
  };

  return (
    <div
      className={styles.container}
      id={cardId}
      style={{
        position: 'relative',
      }}
    >
      {showBar && (
        <div
          className={styles.border}
          style={{
            borderTop: `${barWidth}px solid transparent`,
            borderBottom: `${barWidth}px solid transparent`,
            borderRight: `${barWidth}px solid ${barColor}`,
          }}
        />
      )}
      <div
        className={styles.content}
        style={{
          boxShadow: showBoxShadow
            ? `${hShadow}px ${vShadow}px ${blur}px ${spread}px ${shadowColor}`
            : null,
          borderRadius: showBar ? `0 ${borderRadius}px ${borderRadius}px 0` : borderRadius,
          borderColor: cardBorderColor,
        }}
      >
        <Card {...cardProps} />
      </div>
    </div>
  );
}

CustomizeCard.propTypes = {
  style: PropTypes.object,
  lang: PropTypes.string,
};

export default CustomizeCard;
