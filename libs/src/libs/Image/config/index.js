import React from 'react';

import UploadImg from '../../../components/UploadImg';

const TextConfig = props => {
  return (
    <div>
      <UploadImg {...props} isImage={true}></UploadImg>
    </div>
  );
};

export default TextConfig;
