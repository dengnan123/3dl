import PropTypes from 'prop-types';
import CommonContent from './CommonContent';
function ExcelConfig(props) {
  const { data, propsForm } = props;

  return (
    <>
      <CommonContent propsForm={propsForm} data={data} />
    </>
  );
}

ExcelConfig.propTypes = {
  propsForm: PropTypes.object,
  data: PropTypes.object,
  staticData: PropTypes.object,
};

export default ExcelConfig;
