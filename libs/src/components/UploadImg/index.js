import React, { useState, Fragment } from 'react';
import { Upload, Icon, Switch, Button } from 'antd';
import classnames from 'classnames';

import { copyToClip } from '../../helpers/utils';
import styles from './index.less';

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

// function beforeUpload(file) {
//   // const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif';
//   // if (!isJpgOrPng) {
//   //   message.error('You can only upload JPG/PNG file!');
//   // }
//   const isLt2M = file.size / 1024 / 1024 < 2;
//   if (!isLt2M) {
//     message.error('Image must smaller than 2MB!');
//   }
//   return  isLt2M;
// }
const UploadImg = props => {
  const { id, addDataUseCompList, API_HOST = 'http://localhost', pageId, style, isImage } = props;

  const [{ loading }, setState] = useState({
    loading: false,
    imageUrl: null,
  });
  const [switchData, setSwitch] = useState(false);

  const handleChange = info => {
    if (info.file.status === 'uploading') {
      setState(v => {
        return {
          ...v,
          loading: true,
        };
      });
      return;
    }
    if (info.file.status === 'done') {
      const { errorCode, data } = info.file.response;
      if (errorCode === 200) {
        // 更新最新数据
        addDataUseCompList(data);
        getBase64(info.file.originFileObj, imageUrl => {
          setState({
            imageUrl,
            loading: false,
          });
        });
      }
    }
  };

  const uploadButton = (
    <div>
      <Icon type={loading ? 'loading' : 'plus'} />
      <div className="ant-upload-text">Upload</div>
    </div>
  );

  const data = {
    id,
    pageId,
    saveType: 'image',
    useName: switchData,
  };

  const change = v => {
    setSwitch(v);
  };

  const imgUrl = `${window.DP_STATIC_PATH}/${style?.filename}`;

  return (
    <Fragment>
      <div className={classnames(styles.itemDiv, { [styles.imagesStyle]: isImage })}>
        <span>上传图片:</span>
        <p>
          <Upload
            name="file"
            data={data}
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            action={`${API_HOST}/page-comp/upload`}
            // beforeUpload={beforeUpload}
            onChange={handleChange}
          >
            {uploadButton}
          </Upload>
        </p>
      </div>
      <div className={classnames(styles.itemDiv, { [styles.imagesStyle]: isImage })}>
        <span>保存图片原名称:</span>
        <p>
          <Switch value={switchData} onChange={change}></Switch>
        </p>
      </div>
      <div className={classnames(styles.itemDiv, { [styles.imagesStyle]: isImage })}>
        <span>图片链接:</span>
        <p className={styles.copyButton}>
          {style?.filename ? (
            <Button
              onClick={() => {
                copyToClip(imgUrl);
              }}
              type="link"
            >
              {imgUrl}
            </Button>
          ) : null}
        </p>
      </div>
    </Fragment>
  );
};

export default UploadImg;
