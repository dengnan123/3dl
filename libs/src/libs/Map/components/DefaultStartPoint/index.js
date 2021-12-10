import React, { Component, Fragment } from 'react';

import { Input } from 'antd';

class DefaultStartPoint extends Component {
  changeCenterPoint = (x, y) => {
    const { onChange, value } = this.props;
    let obj = { ...value, x, y };
    onChange(obj);
  };

  render() {
    const { Form, value } = this.props;
    return (
      <Fragment>
        <Form.Item label="默认起点X坐标" layout="vertical">
          <Input
            type="number"
            style={{ width: '100%' }}
            placeholder="起点X坐标"
            defaultValue={value.x || undefined}
            onChange={e => {
              let x = e.target.value;
              this.changeCenterPoint(x, value.y);
            }}
          />
        </Form.Item>

        <Form.Item label="默认起点Y坐标" layout="vertical">
          <Input
            type="number"
            style={{ width: '100%' }}
            placeholder="起点Y坐标"
            defaultValue={value.y || undefined}
            onChange={e => {
              let y = e.target.value;
              this.changeCenterPoint(value.x, y);
            }}
          />
        </Form.Item>
      </Fragment>
    );
  }
}

DefaultStartPoint.propTypes = {};

export default DefaultStartPoint;
