import PropTypes from 'prop-types';
import RenderImg from '../../../../components/RenderImg';
import waitingPic from '../../../../assets/waiting.png';
import doingPic from '../../../../assets/doing.png';
import staffPic from '../../../../assets/staff.png';
import OrderItem from './OrderItem/OrderItem';

const OrderItemConatiner = props => {
  const { style = {}, data = {} } = props;
  const {
    itemWidth = 1000,
    itemHeight = 90,
    timeFontSize = 30,
    floorFontSize = 28,
    contentFontSize = 28,
    staffFontSize = 24,
    blinkFrequency,
    borderColor,
    openBorderBlink = false,
    blinkDuration,
    orderStatus = 1,
  } = style;

  const waingIcon = <RenderImg defPic={waitingPic} width="24px" height="24px" />;
  const doingIcon = <RenderImg defPic={doingPic} width="24px" height="24px" />;
  const staffIcon = <RenderImg defPic={staffPic} width="25px" height="28px" />;

  const config = {
    itemWidth,
    itemHeight,
    timeFontSize,
    floorFontSize,
    contentFontSize,
    staffFontSize,
    waingIcon,
    doingIcon,
    staffIcon,
    blinkFrequency: `${blinkFrequency}ms`,
    borderColor,
    openBorderBlink,
    blinkDuration,
  };

  const itemData = {
    orderTime: '2020-07-06 14:30:28',
    backgroundColor: '#eeeeee33',
    floor: '100FF',
    orderStatus: orderStatus,
    orderDetail: '墙内热水管破裂，急需人维修物业最大努力去修复。',
    staff: { name: '李不修' },
    isSelect: false,
    serviceTypeName: '【强电报障】',
    username: '系统系统',
    ...data,
  };
  //
  return <OrderItem config={config} itemData={itemData} />;
};

OrderItemConatiner.propTypes = {
  style: PropTypes.object,
  data: PropTypes.object,
};

export default OrderItemConatiner;
