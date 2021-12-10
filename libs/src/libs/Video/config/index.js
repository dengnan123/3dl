import React, { useEffect } from 'react';
import { debounce } from 'lodash';
import { Form, Input, Select, Switch, Collapse } from 'antd';

import { reap } from '../../../components/SafeReaper';
import UploadImg from '../../../components/UploadImg';

const { Panel } = Collapse;

const VideoConfig = props => {
  const {
    style = {},
    form: { getFieldDecorator, resetFields },
    formItemLayout,
    id,
  } = props;

  useEffect(() => {
    resetFields();
  }, [resetFields, style, id]);

  return (
    <div style={{ paddingLeft: 10, paddingRight: 10 }}>
      <Collapse>
        <Panel header="基础设置">
          <Form.Item label="视频链接" {...formItemLayout}>
            {getFieldDecorator('videoSrc', {
              initialValue: reap(
                style,
                'videoSrc',
                '//img.tukuppt.com/video_show/2269348/00/02/23/5b52ff923e41e.mp4',
              ),
            })(<Input.TextArea placeholder="请输入视频链接" />)}
          </Form.Item>

          <UploadImg {...props}></UploadImg>

          <Form.Item label="播放前图片链接" {...formItemLayout}>
            {getFieldDecorator('basic.poster', {
              initialValue: reap(style, 'basic.poster'),
            })(<Input.TextArea placeholder="请输入播放前图片链接" />)}
          </Form.Item>

          <Form.Item label="自动播放" {...formItemLayout}>
            {getFieldDecorator('basic.autoPlay', {
              initialValue: reap(style, 'basic.autoPlay', false),
              valuePropName: 'checked',
            })(<Switch />)}
          </Form.Item>

          <Form.Item label="循环播放" {...formItemLayout}>
            {getFieldDecorator('basic.loop', {
              initialValue: reap(style, 'basic.loop', false),
              valuePropName: 'checked',
            })(<Switch />)}
          </Form.Item>

          <Form.Item label="预加载" {...formItemLayout}>
            {getFieldDecorator('basic.preload', {
              initialValue: reap(style, 'basic.preload', 'auto'),
            })(
              <Select>
                <Select.Option value="auto">自动</Select.Option>
                <Select.Option value="none">不预加载</Select.Option>
                <Select.Option value="metadata">metadata</Select.Option>
              </Select>,
            )}
          </Form.Item>

          <Form.Item label="默认静音" {...formItemLayout}>
            {getFieldDecorator('basic.muted', {
              initialValue: reap(style, 'basic.muted', false),
              valuePropName: 'checked',
            })(<Switch />)}
          </Form.Item>

          <Form.Item label="隐藏控制栏" {...formItemLayout}>
            {getFieldDecorator('controlBar.disabled', {
              initialValue: reap(style, 'controlBar.disabled', false),
              valuePropName: 'checked',
            })(<Switch />)}
          </Form.Item>
        </Panel>

        <Panel header="播放/暂停按钮">
          <Form.Item label="是否隐藏" {...formItemLayout}>
            {getFieldDecorator('playToggle.disabled', {
              initialValue: reap(style, 'playToggle.disabled', false),
              valuePropName: 'checked',
            })(<Switch />)}
          </Form.Item>
        </Panel>

        <Panel header="回退按钮">
          <Form.Item label="是否隐藏" {...formItemLayout}>
            {getFieldDecorator('replayControl.disabled', {
              initialValue: reap(style, 'replayControl.disabled', false),
              valuePropName: 'checked',
            })(<Switch />)}
          </Form.Item>

          <Form.Item label="回退时间(秒)" {...formItemLayout}>
            {getFieldDecorator('replayControl.seconds', {
              initialValue: reap(style, 'replayControl.seconds', 5),
            })(
              <Select>
                <Select.Option value={5}>5秒</Select.Option>
                <Select.Option value={10}>10秒</Select.Option>
                <Select.Option value={30}>30秒</Select.Option>
              </Select>,
            )}
          </Form.Item>
        </Panel>

        <Panel header="前进按钮">
          <Form.Item label="是否隐藏" {...formItemLayout}>
            {getFieldDecorator('forwardControl.disabled', {
              initialValue: reap(style, 'forwardControl.disabled', false),
              valuePropName: 'checked',
            })(<Switch />)}
          </Form.Item>

          <Form.Item label="前进时间(秒)" {...formItemLayout}>
            {getFieldDecorator('forwardControl.seconds', {
              initialValue: reap(style, 'forwardControl.seconds', 5),
            })(
              <Select>
                <Select.Option value={5}>5秒</Select.Option>
                <Select.Option value={10}>10秒</Select.Option>
                <Select.Option value={30}>30秒</Select.Option>
              </Select>,
            )}
          </Form.Item>
        </Panel>

        <Panel header="音量按钮">
          <Form.Item label="是否隐藏" {...formItemLayout}>
            {getFieldDecorator('volumeMenuButton.disabled', {
              initialValue: reap(style, 'volumeMenuButton.disabled', false),
              valuePropName: 'checked',
            })(<Switch />)}
          </Form.Item>

          <Form.Item label="音量控制栏是否垂直" {...formItemLayout}>
            {getFieldDecorator('volumeMenuButton.vertical', {
              initialValue: reap(style, 'volumeMenuButton.vertical', false),
              valuePropName: 'checked',
            })(<Switch />)}
          </Form.Item>
        </Panel>
        <Panel header="进度条">
          <Form.Item label="是否隐藏" {...formItemLayout}>
            {getFieldDecorator('progressControl.disabled', {
              initialValue: reap(style, 'progressControl.disabled', false),
              valuePropName: 'checked',
            })(<Switch />)}
          </Form.Item>
        </Panel>
        <Panel header="全屏按钮">
          <Form.Item label="是否隐藏" {...formItemLayout}>
            {getFieldDecorator('fullscreenToggle.disabled', {
              initialValue: reap(style, 'fullscreenToggle.disabled', false),
              valuePropName: 'checked',
            })(<Switch />)}
          </Form.Item>
        </Panel>
      </Collapse>
    </div>
  );
};

export default Form.create({
  onFieldsChange: debounce((props, changedFields, allFields) => {
    const {
      form: { getFieldsValue },
      style,
      updateStyle,
    } = props;

    const newFields = getFieldsValue();
    // 处理数据

    updateStyle({
      ...style,
      ...newFields,
    });
  }, 500),
})(VideoConfig);
