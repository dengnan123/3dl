import React, { useState, useCallback } from 'react';
import { Form, Upload, message, Icon, Button } from 'antd';

function beforeUpload(file) {
  const isLt2M = file.size / 1024 / 1024 < 20;
  if (!isLt2M) {
    message.error('Image must smaller than 20MB!');
  }
  return isLt2M;
}
const UploadFile = props => {
  const {
    action,
    data = {},
    onChange,
    API_HOST = 'http://localhost',
    value,
    beforeUpload: propsBeforeUpload,
    clickText = 'Click to Upload',
  } = props;

  let initList = [];
  if (value) {
    initList = [
      {
        uid: '-1',
        name: value,
        status: 'done',
        url: `${API_HOST}/static/pic/${value}`,
      },
    ];
  }

  const [fileList, setFileList] = useState(initList);

  // const [{ loading, previewVisible, previewImage }, setState] = useState({
  //   loading: false,
  //   imageUrl: null,
  //   previewVisible: false,
  //   previewImage: null,
  // });

  const handleChange = useCallback(
    info => {
      //removed
      console.log('info.file.status', info.file.status);
      if (info.file.status === 'removed') {
        onChange(null);
      }
      if (info.file.status === 'uploading') {
        // setState(v => {
        //   return {
        //     ...v,
        //     loading: true,
        //   };
        // });
      }
      if (info.file.status === 'done') {
        const { errorCode, data } = info.file.response;
        if (errorCode === 200) {
          onChange(data);
          // setState(v => {
          //   return {
          //     ...v,
          //     loading: false,
          //   };
          // });
        }
      }
      setFileList(info.fileList);
    },
    [onChange, setFileList],
  );

  return (
    <div>
      <Upload
        name="file"
        data={data}
        action={action}
        beforeUpload={propsBeforeUpload || beforeUpload}
        onChange={handleChange}
        fileList={fileList}
      >
        <Button>
          <Icon type="upload" /> {clickText}
        </Button>
      </Upload>
    </div>
  );
};

export default Form.create()(UploadFile);
