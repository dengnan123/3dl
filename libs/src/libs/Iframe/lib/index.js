import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { usePostmessage, useGetUrl } from './util';

const Iframe = props => {
  const {
    style: {
      iframeUrl,
      openBale = false,
      iframeUrlHostKey = '',
      frameborder = false,
      scrolling = 'yes',
      noRefreshSwitch,
      useMinWidth = false,
      useOverflowHiddenY = false,
      minWidth = 0,
    },
    otherCompParams = {},
    id: iframeId,
  } = props;
  const { url, height } = otherCompParams.menu || {};
  const finalUrl = openBale && window.DP_ENV === 'release' ? iframeUrlHostKey : iframeUrl;
  const wrapperRef = useRef(null);
  const urlRef = useRef(url || finalUrl);
  useEffect(() => {
    if (!wrapperRef) return;
    wrapperRef.current.scrollTop = 0;
    urlRef.current = url || finalUrl;
  }, [url, finalUrl]);

  const isNonContent = !finalUrl && !url;

  const srcUrl = useGetUrl({
    iframeUrl: finalUrl,
    url,
    noRefreshSwitch,
  });

  usePostmessage({
    url,
    noRefreshSwitch,
    iframeId,
  });

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        overflowX: useMinWidth ? 'auto' : 'hidden',
        overflowY: useOverflowHiddenY ? 'hidden' : 'auto',
      }}
      ref={wrapperRef}
    >
      {isNonContent ? (
        '请填写有效的链接！'
      ) : (
        <iframe
          frameBorder={Number(frameborder)}
          scrolling={scrolling}
          width="100%"
          height={height || '100%'}
          style={{
            minWidth: useMinWidth ? minWidth : 'unset',
          }}
          title="myIframe"
          src={srcUrl}
          seamless="seamless"
          id={iframeId}
        />
      )}
    </div>
  );
};

Iframe.propTypes = {
  style: PropTypes.object,
};

export default Iframe;
