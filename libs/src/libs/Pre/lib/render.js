export const normalRender = ({ renderData, onChange }) => {
  return renderData.map((v, i) => {
    const { width, height, style, data, compName, renderChildComp } = v;
    const itemProps = {
      width,
      height,
      style,
      position: 'relative',
      margin: 'auto',
      data,
      onChange: params => {
        onChange &&
          onChange({
            ...v,
            params: {
              ...params,
              compName,
            },
          });
      },
    };
    return (
      <div key={i} style={itemProps}>
        {renderChildComp}
      </div>
    );
  });
};

export const dyListRender = ({
  onChange,
  renderData,
  dyList,
  pageSize,
  listItemdistance,
  listHeight,
}) => {
  // 列表动态渲染组件
  if (!renderData?.length) {
    return;
  }
  const dyTotal = getDyTotal({
    dyList,
    pageSize,
  });

  const compData = renderData[0];
  const { width, height, style, compName, renderChildCompFunc } = compData;

  return Array(dyTotal)
    .fill(0)
    .map((v, index) => {
      const list = getPerPageList({
        dyList,
        pageSize,
        current: index,
      });
      const itemProps = {
        width,
        height: listHeight,
        style,
        position: 'relative',
        margin: 'auto',
        onChange: params => {
          onChange &&
            onChange({
              ...v,
              params: {
                ...params,
                compName,
              },
            });
        },
      };
      return (
        <div key={index} style={itemProps}>
          {list.map((v, index) => {
            const isLast = index === list?.length - 1;
            return (
              <div
                key={index}
                style={{ width, height, marginBottom: !isLast ? listItemdistance : 0 }}
              >
                {renderChildCompFunc(v)}
              </div>
            );
          })}
        </div>
      );
    });
};

export const getDyTotal = ({ dyList = [], pageSize }) => {
  const len = dyList.length;
  if (len <= pageSize) {
    return 1;
  }
  const m = len / pageSize;
  if (isInteger(m)) {
    return m;
  }
  return Math.floor(m) + 1;
};

export const getPerPageList = ({ dyList = [], pageSize, current }) => {
  const startIndex = current * pageSize;
  const endIndex = current * pageSize + pageSize;
  return dyList.slice(startIndex, endIndex);
};

export const render = props => {
  if (props.openListCarousel) {
    return dyListRender(props);
  }
  return normalRender(props);
};

const isInteger = num => {
  return Math.floor(num) === num;
};

export const getTotal = ({ openListCarousel, renderData, dyList, pageSize }) => {
  if (openListCarousel) {
    return getDyTotal({
      dyList,
      pageSize,
    });
  }
  return renderData?.length ?? 0;
};
