import React, { useState, useCallback } from 'react';
import { Form, Upload, message, Icon, Modal } from 'antd';
import { staticPath } from '@/config';

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

function beforeUpload(file) {
  const isJpgOrPng =
    file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG/gif file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
}
const TextConfig = props => {
  const { action, data = {}, onChange, value } = props;

  //   let fileList = [];

  const { saveKey } = data;

  let initList = [];
  if (value) {
    initList = [
      {
        uid: '-1',
        name: 'image.png',
        status: 'done',
        url: `${staticPath}/${data.id}/${value}`,
      },
    ];
  }

  const [fileList, setFileList] = useState(initList);

  const [{ loading, previewVisible, previewImage }, setState] = useState({
    loading: false,
    imageUrl: null,
    previewVisible: false,
    previewImage: null,
  });

  const handleChange = useCallback(
    info => {
      //removed
      console.log('info.file.status', info.file.status);
      if (info.file.status === 'removed') {
        onChange(null);
      }
      if (info.file.status === 'uploading') {
        setState(v => {
          return {
            ...v,
            loading: true,
          };
        });
      }
      if (info.file.status === 'done') {
        const { errorCode, data } = info.file.response;
        if (errorCode === 200) {
          onChange(data[saveKey]);
          setState(v => {
            return {
              ...v,
              loading: false,
            };
          });
        }
      }
      setFileList(info.fileList);
    },
    [onChange, setFileList, saveKey],
  );

  const uploadButton = (
    <div>
      <Icon type={loading ? 'loading' : 'plus'} />
      <div className="ant-upload-text">Upload</div>
    </div>
  );

  const handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setState(v => {
      return {
        ...v,
        previewImage: file.url || file.preview,
        previewVisible: true,
      };
    });
  };

  const handleCancel = () => {
    setState(v => {
      return {
        ...v,
        previewVisible: false,
      };
    });
  };

  return (
    <div>
      <Upload
        // name="file"
        data={data}
        listType="picture-card"
        // className="avatar-uploader"
        action={action}
        beforeUpload={beforeUpload}
        onChange={handleChange}
        fileList={fileList}
        onPreview={handlePreview}
      >
        {/* {uploadButton} */}
        {fileList.length > 0 ? null : uploadButton}
      </Upload>

      <Modal visible={previewVisible} footer={null} onCancel={handleCancel}>
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </div>
  );
};

export default Form.create()(TextConfig);
