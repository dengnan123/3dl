/**
 * 组件 => 边框的.边框样式
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Radio } from 'antd';

class BorderStyle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.borderStyle || 'solid',
    };
  }

  changeValue = e => {
    const { updateStyle, style } = this.props;
    let value = e.target.value
    this.setState({ value });
    const data = { borderStyle: value };
    updateStyle({
      ...style,
      ...data,
    });
  };
  
  render() {
    const { value } = this.state;
    const TAL = {
      width: '100%',
      paddingTop: '10px',
      textAlign: 'left',
    };
    return (
      <Row>
        <Radio.Group onChange={this.changeValue}  defaultValue={value}>
          <Radio style={TAL} value='solid'>
            实线
          </Radio>
          <Radio style={TAL} value='dotted'>
            点状
          </Radio>
          <Radio style={TAL} value='double'>
            双线
          </Radio>
          <Radio style={TAL} value='dashed'>
            虚线
          </Radio>
        </Radio.Group>
      </Row>
    );
  }
}

BorderStyle.propTypes = {
  updateStyle: PropTypes.func,
  style: PropTypes.object,
};

export default BorderStyle;
