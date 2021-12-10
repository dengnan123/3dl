import { useRef, useEffect, useState } from 'react';

const defaultStyle = {
  size: 'default',
  autoWrap: false,
  bordered: true,
  borderColor: '#e8e8e8',
  bgColor: 'rgba(255,255,255,0)',
  // 表头配置
  header: {
    showHeader: true,
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.85)',
    bgColor: '#fafafa',
    isFixed: false,
    scrollY: 300,
  },
  // 列配置
  column: {
    align: 'left',
    ellipsis: false,
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.65)',
    emptyText: '',
    emptyList: [],
    useRenderFunc: false,
    renderFunc: getDefaultColumnRenderStr(),
    isFixed: false,
    leftFixed: 0,
    rightFixed: 0,
    scrollX: 1200,
    fixedWidth: 200,
  },
  // 行配置
  row: {},
  // 分页配置
  pagination: {
    show: true,
    position: 'bottom',
    size: 'default',
    hideOnSinglePage: false,
    showLessItems: false,
    showQuickJumper: false,
    showSizeChanger: false,
    simple: false,
  },
};

/**
 * style 取值
 * @param {object} propsStyle
 */
export function useStyle(propsStyle) {
  const styleRef = useRef();
  const [style, setStyle] = useState(defaultStyle);

  useEffect(() => {
    if (!styleRef.current || JSON.stringify(styleRef.current) !== JSON.stringify(propsStyle)) {
      const newStyle = { ...defaultStyle, ...propsStyle };
      styleRef.current = newStyle;
      setStyle(newStyle);
    }
  }, [propsStyle]);

  return style;
}

function getDefaultColumnRenderStr() {
  return `const { column, text, index } = data;

  function renderName() {
    if (index !== 4) {
      return text;
    }
    return {
      children: text,
      props: {
        colSpan: 5,
      },
    };
  }

  function renderContent() {
    const obj = {
      children: text,
      props: {},
    };
    if (index === 4) {
      obj.props.colSpan = 0;
    }
    return obj;
  }

  function renderTel() {
    const obj = {
      children: text,
      props: {},
    };
    if (index === 2) {
      obj.props.rowSpan = 2;
    }

    if (index === 3) {
      obj.props.rowSpan = 0;
    }
    if (index === 4) {
      obj.props.colSpan = 0;
    }
    return obj;
  }
  if (column.dataIndex === 'name') {
    return renderName();
  }
  if (column.dataIndex === 'tel') {
    return renderTel();
  }
  return renderContent();`;
}
