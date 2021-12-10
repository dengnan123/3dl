import React, { Component } from 'react';
import { Row, Col, Slider, InputNumber } from 'antd';

class InputOpacity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: 1,
    };
  }

  _update = opacity => {
    const { updateStyle, style } = this.props;
    // let newFields = getFieldsValue();

    updateStyle({
      ...style,
      ...opacity,
      // ...newFields,
    });
  };

  changeValue = value => {
    this.setState({ inputValue: value });
    this._update({ opacity: value });
  };

  render() {
    const { inputValue } = this.state;
    const transMarks = {
      0: 0,
      0.5: 0.5,
      1: 1,
    };

    return (
      <Row>
        <Col span={16}>
          <Slider
            min={0}
            max={1}
            step={0.01}
            marks={transMarks}
            included={true}
            value={typeof inputValue === 'number' ? inputValue : 0}
            onChange={this.changeValue}
          />
        </Col>
        <Col span={4}>
          <InputNumber
            min={0}
            max={1}
            style={{ marginLeft: 16 }}
            step={0.01}
            value={inputValue}
            onChange={this.changeValue}
          />
        </Col>
      </Row>
    );
  }
}

InputOpacity.propTypes = {};

export default InputOpacity;
