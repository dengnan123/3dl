import Col from 'antd/lib/col';
// import styles from './index.less';
import { filterObj } from '../../../../helpers/utils';
// import { reap } from '../../../../components/SafeReaper';

const CoreNumber = props => {
  const { data = [], style } = props;

  const green = {
    background: 'linear-gradient(45deg, rgb(68, 184, 35), rgb(27, 141, 40))',
  };
  const red = {
    background: 'linear-gradient(45deg, rgb(240, 80, 80), rgb(236, 101, 33))',
  };
  const rateLevel = { green: green, red: red };

  const _style = filterObj(style, ('', null, undefined));
  // const RowNumber = reap(_style, 'RowNumber', 0);
  // const spacing = reap(_style, 'spacing', 10);
  // const borderRadius = reap(_style, 'borderRadius', 10);
  // const fontSizeValue = reap(_style, 'fontSizeValue', 20);
  // const fontSizeName = reap(_style, 'fontSizeName', 15);
  // const fontSizeIndex = reap(_style, 'fontSizeIndex', 15);
  // const background = reap(_style, 'background', '');
  // const gradualChangeObject = reap(_style, 'gradualChangeObject', 'backround');
  // const gradualChangeFirst = reap(_style, 'gradualChangeFirst', '');
  // const gradualChangeLast = reap(_style, 'gradualChangeLast', '');
  // const customizeCard = reap(_style, 'customizeCard', false);

  const {
    RowNumber,
    spacing,
    borderRadius,
    fontSizeValue,
    fontSizeName,
    fontSizeIndex,
    backgroundGradual,
    // gradualChangeObject,
    gradualChangeFirst,
    gradualChangeLast,
    // customizeCard,
  } = _style;

  const padding =
    RowNumber === 1 ? { paddingTop: spacing } : { paddingTop: spacing, paddingLeft: spacing };
  const background = backgroundGradual
    ? { background: `linear-gradient(45deg, ${gradualChangeFirst}, ${gradualChangeLast})` }
    : { background: `rgb()` };
  const newStyle = {
    ...padding,
    borderRadius,
    ...background,
  };

  return (
    <div>
      <span>此组件正在开发中</span>
      {Array.isArray(data) &&
        data.map((item, index) => {
          return (
            <Col key={index} style={(rateLevel[item.rate_level], { ...newStyle })}>
              <div style={{ fontSize: fontSizeValue }}>
                {item.value} <span style={{ fontSize: fontSizeIndex }}>{item.rate}</span>
              </div>
              <div style={{ fontSize: fontSizeName }}>{item.name}</div>
            </Col>
          );
        })}
    </div>
  );
};

export default CoreNumber;
