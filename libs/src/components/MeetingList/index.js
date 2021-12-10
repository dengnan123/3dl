import moment from 'dayjs';
import ArrowRight from '../../assets/meeting/arrow_right.png';
import styles from './index.less';

function formatTime(t) {
  return moment(t).format('HH:mm');
}

const MeetingList = ({ onChange, data = {}, style = {} }) => {
  const { dataSource } = data || {};
  const {
    color = '#757575',
    highlightColor = '#424242',
    fontSize = 28,
    lineHeight = 40,
    spacing = 10,
    arrowSize = 18,
    arrowMarginRight = 10,
  } = style;

  const currentTime = moment().valueOf();

  return (
    <ul className={styles.list}>
      {(dataSource || []).map((n, index) => {
        const { startTime, endTime, title, organizerName } = n || {};
        const isActive = currentTime >= startTime && currentTime <= endTime;
        return (
          <li
            key={index}
            style={{
              color: !isActive ? color : highlightColor,
              fontSize,
              lineHeight: `${lineHeight}px`,
              paddingLeft: arrowSize + arrowMarginRight,
            }}
          >
            {isActive && (
              <i
                className={styles.arrow}
                style={{
                  backgroundImage: `url(${ArrowRight})`,
                  width: arrowSize,
                  height: arrowSize,
                }}
              ></i>
            )}
            <span style={{ marginRight: spacing }}>{`${formatTime(startTime)} - ${formatTime(
              endTime,
            )}`}</span>
            <span style={{ marginRight: spacing }}>{title}</span>
            <span>{organizerName}</span>
          </li>
        );
      })}
    </ul>
  );
};

export default MeetingList;
