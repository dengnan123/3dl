import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Input, Button, Icon } from 'antd';

class StartGroup extends Component {
  add = () => {
    const { onChange, value: startGroup } = this.props;
    const number = startGroup.length;
    for (const item of startGroup) {
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
    onChange([...startGroup, obj]);
  };

  remove = () => {
    const { onChange, value: startGroup } = this.props;
    if (startGroup.length === 0) return;
    let newArr = startGroup;
    newArr.pop();
    let max = newArr.length - 1;
    if (newArr.length !== 0) {
      newArr[max].show = true;
    }
    onChange(startGroup);
  };

  _changeValue = (val, type, index) => {
    const { onChange, value: startGroup } = this.props;
    const data = startGroup;
    data[index][type] = val;
    onChange(data);
  };

  render() {
    const { Form, value: startGroup } = this.props;

    return (
      <Fragment>
        {startGroup.length &&
          startGroup.map((item, i) => {
            return (
              <Fragment>
                <Form.Item label={item.floor}>
                  <div>
                    <div>
                      <div style={{ display: 'flex' }}>
                        <span>X:</span>
                        <Input
                          defaultValue={item.x}
                          placeholder={`${i + 1}F,默认起点X坐标`}
                          onChange={e => {
                            this._changeValue(e.target.value, 'x', i);
                          }}
                        />
                      </div>
                      <div style={{ display: 'flex' }}>
                        <span>Y:</span>
                        <Input
                          defaultValue={item.y}
                          placeholder={`${i + 1}F,默认起点Y坐标`}
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
            <Icon type="plus" /> 添加起点
          </Button>
          <Button onClick={this.remove}>
            <Icon type="minus-circle" /> 删除起点
          </Button>
        </div>
      </Fragment>
    );
  }
}

StartGroup.propTypes = {
  onChange: PropTypes.func,
};

export default StartGroup;
