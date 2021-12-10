import { useEffect, useRef } from 'react';
import qs from 'query-string';

export const usePostmessage = ({ url, noRefreshSwitch, iframeId }) => {
  const oldDataRef = useRef();
  const urlRef = useRef();
  useEffect(() => {
    if (!noRefreshSwitch) {
      return;
    }
    if (!url) {
      return;
    }
    const urlData = qs.parseUrl(url);
    const newPageId = urlData?.query?.pageId;
    if (!newPageId) {
      return;
    }
    if (oldDataRef.current?.pageId === newPageId) {
      return;
    }
    const iFrame = document.getElementById(iframeId);
    const iframeUrl = urlRef.current || url;
    iFrame.contentWindow.postMessage(urlData?.query, iframeUrl);
    oldDataRef.current = urlData?.query;
    if (!urlRef.current) {
      urlRef.current = url;
    }
  }, [noRefreshSwitch, url, iframeId]);
};

export const useGetUrl = ({ iframeUrl, url, noRefreshSwitch }) => {
  const urlRef = useRef();
  if (!noRefreshSwitch) {
    return url || iframeUrl;
  }
  if (urlRef.current) {
    return urlRef.current;
  }
  urlRef.current = url;
  return url;
};
