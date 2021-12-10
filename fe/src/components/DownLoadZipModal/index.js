import React, { useState } from 'react';
import RfReceiver from '@/components/RfReceiver';
import { API_HOST } from '@/config';
import { Button, message } from 'antd';

export default ({ pageId, socketData: { errorCode } }) => {
  const [downlowadLoading, setLoading] = useState(false);
  if (errorCode === 200) {
    return <span>打包失败请重试</span>;
  }
  return (
    <RfReceiver
      url={`${API_HOST}/page/download/?pageId=${pageId}`}
      // fileName={`${before}-${nowDay}_${nowClickRowKey}_log.zip`}
      fileMIMEType="application/octet-stream"
      onProgress={event => {
        const { complete, downloadSuccess } = event;
        if (downloadSuccess === false) {
          message.error(`Download log failed`);
          return;
        }
        let value = true;
        if (complete === 100 || complete === 0) {
          value = false;
        }
        setLoading(value);
      }}
    >
      <Button type="primary" loading={downlowadLoading}>
        {downlowadLoading ? '下载中' : '下载'}
      </Button>
    </RfReceiver>
  );
};
