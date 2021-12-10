/**
 * 边框的边框设置组件
 */

import React, { Component } from 'react';
import { Row, Radio } from 'antd';

class BorderSetting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.style.borderSetting || 2,
    };
  }

  onChange = e => {
    const { updateStyle, style } = this.props;
    let num = e.target.value;
    this.setState({ value: num });
    let data = { borderSetting: num };
    updateStyle({
      ...style,
      ...data,
    });
  };

  render() {
    const TAL = {
      width: '100%',
      paddingTop: '10px',
      textAlign: 'left',
    };

    return (
      <Row>
        <Radio.Group onChange={this.onChange} value={this.state.value}>
          <Radio style={TAL} value={0}>
            无
          </Radio>
          <Radio style={TAL} value={1}>
            简单边框
          </Radio>
          <Radio style={TAL} value={2}>
            内置边框
          </Radio>
          <Radio style={TAL} value={3}>
            自定义边框
          </Radio>
        </Radio.Group>
      </Row>
    );
  }
}

export default BorderSetting;
