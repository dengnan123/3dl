/**
 * echarts 事件枚举
 * @see https://echarts.apache.org/zh/api.html#events
 * @enum
 */
export const EchartsEventTypeEnum = {
  /** 点击 */
  click: 'click',
};

export function getEvents({ onChange }) {
  return {
    [EchartsEventTypeEnum.click]: data => {
      onChange && onChange({ _eventType: EchartsEventTypeEnum.click, data });
    },
  };
}
