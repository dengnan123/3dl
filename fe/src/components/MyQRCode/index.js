import PropTypes from 'prop-types';
import QRCode from 'qrcode.react';

function MyQRCode(props) {
  const { visible, src, size, backgroundColor } = props;
  if (!visible) return null;
  return (
    <div
      style={{
        width: size + 2,
        height: size + 2,
        border: '1px solid #d9d9d9',
        position: 'fixed',
        right: 50,
        bottom: 50,
        zIndex: 99999,
      }}
    >
      <QRCode
        value={src} // value参数为生成二维码的链接
        size={size} // 二维码的宽高尺寸
        fgColor={backgroundColor} // 二维码的颜色
      />
    </div>
  );
}

MyQRCode.defaultProps = {
  visible: false,
  size: 100,
  backgroundColor: '#000000',
};

MyQRCode.propTypes = {
  visible: PropTypes.bool,
  src: PropTypes.string,
  size: PropTypes.number,
  backgroundColor: PropTypes.string,
};

export default MyQRCode;
