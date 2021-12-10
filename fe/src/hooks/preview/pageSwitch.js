// import { useCustomCompareEffect } from 'react-use';
import { useEffect, useState, useRef, useCallback } from 'react';
import ReactDom from 'react-dom';
import querystring from 'query-string';
import { isObject, isString, isArray } from 'lodash';
// import isEqual from 'fast-deep-equal';
import io from 'socket.io-client';
import emitter from '@/helpers/mitt';
import { v4 as uuid } from 'uuid';
import animateScrollTo from 'animated-scroll-to';
import { API_SOCKET_PORD_HOST } from '@/config';
import MyQRCode from '@/components/MyQRCode';
import { getParseSearch } from '@/helpers/utils';

export const useIframe = ({ pageConfig, init }) => {
  useEffect(() => {
    async function receiveMessage(event) {
      const { data } = event;
      if (isObject(data)) {
        if (data['dpReloadUrl']) {
          dpReloadUrl(data['dpReloadUrl']);
          return;
        }
        if (data['passParams']) {
          passParams(data['passParams']);
        }
        if (data['showComps']) {
          hiddenOrShowAction(data['showComps'], 'show');
        }
        if (data['hiddenComps']) {
          hiddenOrShowAction(data['hiddenComps'], 'hidden');
        }
        iframePageSwicth({
          data,
          init,
        });
      }
    }
    window.addEventListener('message', receiveMessage, false);
    return () => {
      window.removeEventListener('message', receiveMessage, false);
    };
  }, [pageConfig, init]);
};

export const useDoCustomAction = () => {
  useEffect(() => {
    const doCustomAction = data => {
      if (data['passParams']) {
        passParams(data['passParams']);
      }
      if (data['showComps']) {
        hiddenOrShowAction(data['showComps'], 'show');
      }
      if (data['hiddenComps']) {
        hiddenOrShowAction(data['hiddenComps'], 'hidden');
      }
      if (data['changeGridHeight']) {
        changeGridHeight(data['changeGridHeight']);
      }
    };
    window.doCustomAction = doCustomAction;
  }, []);
};

export const useSocketSwitch = ({ pageConfig, init }) => {
  useEffect(() => {
    const { socketUrl } = pageConfig;
    if (!socketUrl) {
      return;
    }
    const socket = io(socketUrl, {
      query: {},
    });
    socket.on('pageSwitch', data => {
      if (!isObject(data)) {
        return;
      }
      const { pageId } = data;
      if (!pageId) {
        return;
      }
      init({
        pageId,
      });
    });
    return () => {
      socket.close();
    };
  }, [pageConfig, init]);
};

/**
 * 页面切换 监听函数,只会注册一次
 */
export const usePageSwitch = props => {
  useIframe(props);
  useSocketSwitch(props);
  useSocketHandlePageScroll(props);
  useDoCustomAction();
};

/**
 * 页面切换动画 设置
 */
export const usePageSwitchAnimate = () => {
  const [animateCss, setState] = useState('');
  useEffect(() => {
    emitter.on(`removeAnimate`, data => {
      setState('animate__animated animate__fadeOut');
    });
    emitter.on(`addAnimate`, data => {
      setState(`animate__animated animate__fadeIn`);
    });
  }, [setState]);
  return animateCss;
};

/**
 * 移动端app通过socket控制页面滚动
 */
export function useSocketHandlePageScroll({ init }) {
  /** 滚动的dom */
  const scrollDom = useRef();
  /** 设置id, 用于socket通信判断 */
  const idRef = useRef(getPageScrollId());
  /** socket实例 */
  const socketRef = useRef();
  /** 滚动距离 */
  const scrollRef = useRef({ top: 0 });
  /** socket url */
  const socket_api_host = API_SOCKET_PORD_HOST + '/scroll';
  /** 是否建立连接 */
  const connect = window.location.href.includes('qrcode');
  /** 二维码显示隐藏 */
  const [qrcodeVisible, setQrcodeVisible] = useState(connect);
  /** 平滑滚动 */
  const animateScroll = useCallback(top => {
    let t = parseInt(top || 0);
    if (isNaN(t)) return;
    animateScrollTo(t, { elementToScroll: scrollDom.current, speed: 800 });
  }, []);
  /** 获取页面配置方法 */
  const useInitRef = useRef(init);

  useEffect(() => {
    useInitRef.current = init;
  }, [init]);

  /** 渲染二维码组件 */
  useEffect(() => {
    const pageScrollId = getPageScrollId();
    const d = ReactDom.createPortal(
      <MyQRCode src={`${socket_api_host}?id=${pageScrollId}`} visible={qrcodeVisible} />,
      document.getElementById('containerDiv'),
    );
    ReactDom.render(d, document.getElementById('containerDiv'));
  }, [qrcodeVisible, socket_api_host]);

  /** socket 连接逻辑 */
  useEffect(() => {
    const clearFunc = () => {
      if (!socketRef.current) return;
      socketRef.current.off('connect');
      socketRef.current.off('scroll');
      socketRef.current.off('scrollStart');
      socketRef.current.off('scrollEnd');
      socketRef.current.off('disconnect');
      socketRef.current = null;
    };

    clearFunc();

    if (!socket_api_host || !connect) {
      return clearFunc;
    }

    /** 获取滚动的dom */
    if (!scrollDom.current) {
      scrollDom.current = document.getElementById('containerDiv');
    }

    /** 建立socket连接 */
    const socket = io(socket_api_host, {
      query: { id: idRef.current },
    });

    socket.on('connect', () => {
      console.log('连接成功');
    });

    /** 滚动中 */
    socket.on('scroll', data => {
      const id = data?.id;
      const scrollTop = data?.scrollTop;
      if (!scrollDom.current || id !== idRef.current) return;
      const top = Math.max(scrollRef.current.top + scrollTop, 0);
      animateScroll(top);
    });

    /** 滚动开始，记录当前滚动位置 */
    socket.on('scrollStart', data => {
      const id = data?.id;
      const isStart = data?.isStart;
      if (!scrollDom.current || id !== idRef.current) return;
      /** 一键滚动到顶部 */
      if (isStart) {
        scrollRef.current.top = 0;
        animateScroll(0);
        return;
      }
      const scrollTop = scrollDom.current.scrollTop;
      scrollRef.current.top = scrollTop;
    });

    /** 滚动结束，记录当前滚动位置 */
    socket.on('scrollEnd', data => {
      const id = data?.id;
      const isEnd = data?.isEnd;
      if (!scrollDom.current || id !== idRef.current) return;
      /** 一键滚动到底部 */
      if (isEnd) {
        /** 最大滚动距离 */
        const maxScrollTop = scrollDom.current.scrollHeight - scrollDom.current.offsetHeight;
        scrollRef.current.top = maxScrollTop;
        animateScroll(maxScrollTop);
        return;
      }
      const scrollTop = scrollDom.current.scrollTop;
      scrollRef.current.top = scrollTop;
    });

    /** 切换页面 */
    socket.on('pageSwitch', data => {
      const id = data?.id;
      const pageId = data?.pageId;
      const tagId = data?.tagId;
      const { url, query } = querystring.parseUrl(window.location.href);
      const params = { ...query, pageId, tagId };

      const newUrl = `${url}?${Object.keys(params)
        .map(k => `${k}=${params[k]}`)
        .join('&')}`;

      if (!scrollDom.current || id !== idRef.current || !pageId) return;
      animateScroll(0);
      /** 请求页面数据 */
      if (useInitRef.current && typeof useInitRef.current === 'function') {
        window.history.pushState('', '', newUrl);

        useInitRef.current({
          pageId,
          tagId,
        });
      }
    });

    /** 显示/隐藏二维码 */
    socket.on('qrcode', data => {
      console.log('显示/隐藏二维码');
      const id = data?.id;
      const visible = data?.visible;

      if (!scrollDom.current || id !== idRef.current) return;
      setQrcodeVisible(visible);
    });

    /** 储存socket实例 */
    socketRef.current = socket;

    return clearFunc;
  }, [socket_api_host, connect, animateScroll]);
}

export function getPageScrollId() {
  let id = window.sessionStorage.getItem('_pageScrollId');
  if (!id) {
    id = uuid();
    setPageScrollId(id);
  }
  return id;
}

export function setPageScrollId(id) {
  window.sessionStorage.setItem('_pageScrollId', id);
}

export const iframePageSwicth = async ({ data, init }) => {
  if (!data.pageId) {
    return;
  }
  emitter.emit(`removeAnimate`, { pageId: data.pageId });
  await init({
    pageId: data.pageId,
  });
  emitter.emit(`addAnimate`, { pageId: data.pageId });
};

export const dpReloadUrl = url => {
  if (!isString(url)) {
    return;
  }
  window.location.href = url;
};

export const passParams = passParamsData => {
  // const { pageId } = getParseSearch();
  // 传参 id 可以是单个组件ID 也可以是组件ID数组
  console.log('iframe---->>>>>>>>>passParams', passParamsData);
  const emitFunc = data => {
    const { id, params } = data;
    if (isString(id)) {
      emitter.emit(`${id}_passParams`, params);
      return;
    }
    if (isArray(id)) {
      for (const v of id) {
        emitter.emit(`${v}_passParams`, params);
      }
    }
  };

  if (isArray(passParamsData)) {
    for (const v of passParamsData) {
      emitFunc(v);
    }
    return;
  }

  if (isObject(passParamsData)) {
    emitFunc(passParamsData);
    return;
  }
};

export const hiddenOrShowAction = (arr, action) => {
  for (const id of arr) {
    emitter.emit(`${id}_${action}`);
  }
};

export const changeGridHeight = data => {
  const { id, value } = data;
  emitter.emit(`${id}_changeGridHeight`, value);
};

/**
 * 保存  所有api 被组件使用的引用对象
 */
export const useDataSourceRefCurrent = (dataSourceList = []) => {
  const dataRef = useRef();
  dataRef.current = dataSourceList;

  const dataSourceRef = useRef({});
  useEffect(() => {
    for (const v of dataSourceList) {
      const { id, compHashData } = v;
      dataSourceRef.current[id] = compHashData;
      emitter.on(id, data => {
        const { type, compId } = data;
        // type 可以是 delete 也可以是 add
        const dataSourceData = dataSourceRef.current[id];
        if (type === 'delete') {
          delete dataSourceData[compId];
        } else {
          dataSourceData[compId] = 1;
        }
      });
    }
  }, [dataSourceList.length]);

  return dataSourceRef.current;
};
