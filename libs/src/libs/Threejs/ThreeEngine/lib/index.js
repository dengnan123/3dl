import React from 'react';
import PropTypes from 'prop-types';
import ThreeEngine from '../../../../components/Threejs/ThreeEngine/index.js';

function Index(props) {
  const {
    style = {},
    data = {},
    width = 1920 / 2,
    height = 1080 / 2,
    onChange,
  } = props;
  //1
  //2
  //3
  //4
  //1











  const { remoteResourcesURL = 'https://3dl.dfocus.top/api/static/' } = style;

  return (
    <div style={{ height: '100%', width: '100%' }}>
      <ThreeEngine
        baseResources={remoteResourcesURL}
        handleEvent={onChange && onChange}
        screenSize={[width, height]}
        initData={data}

      />
    </div>
  );
}











//
Index.propTypes = {
  style: PropTypes.object,
  data: PropTypes.object,
  otherCompParams: PropTypes.object,
};

export default Index;



