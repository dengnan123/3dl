import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Input, Button, Icon } from 'antd';

class ButtonGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      number: 0,
      floorArr: [],
    };
  }

  componentDidMount() {
    const { style } = this.props;
    const activeKey = style.activeKey;
    this.setState({
      number: style[activeKey]?.center?.length || 0,
      floorArr: style[activeKey]?.center || [],
    });
  }

  add = () => {
    const { number, floorArr } = this.state;
    const { onChange } = this.props;
    for (const item of floorArr) {
      item.show = false;
    }
    let obj = {
      key: number,
      floor: `${number + 1}F`,
      x: null,
      y: null,
      groupID: number + 1,
      show: true,
    };
    this.setState({
      number: number + 1,
      floorArr: [...floorArr, obj],
    });
    onChange(floorArr);
  };

  remove = () => {
    const { floorArr, number } = this.state;
    if (floorArr.length === 0) return;
    let newArr = floorArr;
    newArr.pop();
    let max = newArr.length - 1;
    if (newArr.length !== 0) {
      newArr[max].show = true;
    }
    this.setState({ number: number - 1, loorArr: newArr });
  };

  _changeValue = (val, type, index) => {
    const { floorArr } = this.state;
    const { onChange } = this.props;
    const data = floorArr;
    data[index][type] = val;
    this.setState({ floorArr: data });
    onChange(data);
  };

  render() {
    const { floorArr } = this.state;
    const { Form } = this.props;

    return (
      <Fragment>
        {floorArr.length &&
          floorArr.map((item, i) => {
            return (
              <Fragment>
                <Form.Item label={item.floor}>
                  <div>
                    <div>
                      <div style={{ display: 'flex' }}>
                        <span>X:</span>
                        <Input
                          defaultValue={item.x}
                          onChange={e => {
                            this._changeValue(e.target.value, 'x', i);
                          }}
                        />
                      </div>
                      <div style={{ display: 'flex' }}>
                        <span>Y:</span>
                        <Input
                          defaultValue={item.y}
                          onChange={e => {
                            this._changeValue(e.target.value, 'y', i);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </Form.Item>
              </Fragment>
            );
          })}

        <div>
          <Button onClick={this.add}>
            <Icon type="plus" /> 添加楼层
          </Button>
          <Button onClick={this.remove}>
            <Icon type="minus-circle" /> 删除楼层
          </Button>
        </div>
      </Fragment>
    );
  }
}

ButtonGroup.propTypes = {
  onChange: PropTypes.func,
};

export default ButtonGroup;
// export default From.create()(ButtonGroup);
