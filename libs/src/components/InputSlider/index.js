import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Slider, InputNumber } from 'antd';

class InputSlider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inputValue: 1,
    };
  }

  _update = valueName => {
    const { updateStyle, style } = this.props;
    // let newFields = getFieldsValue();

    updateStyle({
      ...style,
      ...valueName,
      // ...newFields,
    });
  };

  changeValue = value => {
    const { valueName } = this.props;
    this.setState({ inputValue: value });
    this._update({ [valueName]: value });
  };

  render() {
    const { inputValue } = this.state;
    const {
      transMarks = {
        0: 0,
        0.5: 0.5,
        1: 1,
      },
      min = 0,
      max = 1,
      step = 0.01,
    } = this.props;

    return (
      <Row>
        <Col span={16}>
          <Slider
            min={min}
            max={max}
            step={step}
            marks={transMarks}
            included={true}
            value={typeof inputValue === 'number' ? inputValue : 0}
            onChange={this.changeValue}
          />
        </Col>
        <Col span={4}>
          <InputNumber
            min={min}
            max={max}
            style={{ marginLeft: 16 }}
            step={step}
            value={typeof inputValue === 'number' ? inputValue : 0}
            onChange={this.changeValue}
          />
        </Col>
      </Row>
    );
  }
}

InputSlider.propTypes = {
  updateStyle: PropTypes.func.isRequired,
  style: PropTypes.object,
  transMarks: PropTypes.object,
  valueName: PropTypes.string.isRequired,
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
};

export default InputSlider;
