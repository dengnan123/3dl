import React, { Component, Fragment } from 'react';

import { Input } from 'antd';

class CenterCom extends Component {
  changeCenterPoint = (x, y) => {
    const { onChange, value } = this.props;
    let obj = { ...value, x, y };
    onChange(obj);
  };

  render() {
    const { Form, value } = this.props;

    return (
      <Fragment>
        <Form.Item label="X坐标">
          <Input
            type="number"
            placeholder="中心点X坐标"
            defaultValue={value.x || undefined}
            onChange={e => {
              let x = e.target.value;
              this.changeCenterPoint(x, value.y);
            }}
          />
        </Form.Item>

        <Form.Item label="Y坐标">
          <Input
            type="number"
            placeholder="中心点Y坐标"
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

CenterCom.propTypes = {};

export default CenterCom;
