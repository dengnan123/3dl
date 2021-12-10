import React, { Component } from 'react';
import { Row, Radio } from 'antd';

class RadioGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.style.gradualChangeObject || 'background',
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
    const { RadioArray = [] } = this.props;
    const TAL = {
      width: '100%',
      paddingTop: '10px',
      textAlign: 'left',
    };

    return (
      <Row>
        <Radio.Group onChange={this.onChange} value={this.state.value}>
          {(RadioArray || []).map((item, i) => {
            return (
              <Radio style={TAL} value={item.value}>
                {item.name}
              </Radio>
            );
          })}
        </Radio.Group>
      </Row>
    );
  }
}

export default RadioGroup;
