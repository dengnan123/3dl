const Mask = ({ style = {}, onChange }) => {
  const { backgroundColor = 'grey', opacity = 50 } = style;
  const _opacity = opacity / 100;
  return (
    <div
      onClick={() => onChange && onChange()}
      style={{ backgroundColor, opacity: _opacity, width: '100%', height: '100%' }}
    ></div>
  );
};

export default Mask;
