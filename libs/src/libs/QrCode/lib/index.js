import QrCodeWithLogo from 'qr-code-with-logo';
import { useEffect } from 'react';
import padLogo from '../../../assets/padLogo.png';

const getSrc = (data, style) => {
  if (data.src) {
    return data.src;
  }
  if (style.src) {
    return style.src;
  }
  return padLogo;
};

const getContent = (data, style) => {
  if (data.content) {
    return data.content;
  }
  if (style.content) {
    return style.content;
  }
  return 'https://www.baidu.com';
};

const QrCode = ({ style, data, width = 380 }) => {
  useEffect(() => {
    const myCanvas = document.getElementById('qrcode');
    const { dark = '#393635', logoSize = 0.15, margin = 4 } = style || {};
    let _dark = dark;
    if (dark && !dark.startsWith('#')) {
      _dark = rgba2Color(dark);
    }
    QrCodeWithLogo.toCanvas({
      canvas: myCanvas,
      content: getContent(data, style),
      width,
      logo: {
        src: getSrc(data, style),
        logoSize,
        bgColor: 'transparent',
      },
      nodeQrCodeOptions: {
        color: {
          dark: _dark,
          light: '#00000000',
        },
        margin,
      },
    }).then(res => {
      console.log('success');
    });
  }, [style, data, width]);

  return (
    <canvas
      id="qrcode"
      style={{
        width: 200,
        height: 200,
      }}
    ></canvas>
  );
};

export default QrCode;

function rgba2Color(color) {
  let values = color
    .replace(/rgba?\(/, '')
    .replace(/\)/, '')
    .replace(/[\s+]/g, '')
    .split(',');
  let a = parseFloat(values[3] || 1),
    r = Math.floor(a * parseInt(values[0]) + (1 - a) * 255),
    g = Math.floor(a * parseInt(values[1]) + (1 - a) * 255),
    b = Math.floor(a * parseInt(values[2]) + (1 - a) * 255);
  return (
    '#' +
    ('0' + r.toString(16)).slice(-2) +
    ('0' + g.toString(16)).slice(-2) +
    ('0' + b.toString(16)).slice(-2)
  );
}
