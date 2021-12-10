import React from 'react';
import 'antd/dist/antd.css';
import styles from './index.less';
import InputColor from '../../../../components/InputColor';
import DefaultStartPoint from '../DefaultStartPoint';
import StartGroup from '../StartGroup';
import ButtonGroup from '../ButtonGroup';
import { reap } from '../../../../components/SafeReaper';
import {
  Form,
  Input,
  Button,
  // Modal,
  Switch,
  Collapse,
  Radio,
  InputNumber,
  Icon,
  Tooltip,
  Alert,
  Divider,
} from 'antd';

const { Panel } = Collapse;

function PanelForm(props) {
  const {
    activeKey = '0',
    style,
    updateStyle,
    formItemLayout,
    pageConfig = {},
    form: { getFieldDecorator, setFieldsValue },
  } = props;

  const {
    mapId,
    defaultStatus = false,
    defaultOneStatus = false,
    isStarbucks = false,
    resetStatus = false,
  } = style[activeKey] || {};

  const clickBack = () => {
    setFieldsValue({ backgroundColor: pageConfig.bgc });
  };

  const TAL = {
    width: '100%',
    paddingTop: '10px',
    textAlign: 'left',
  };

  return (
    <Collapse defaultActiveKey={['0']} accordion>
      <Panel header="地图ID">
        <Alert
          type="success"
          message={
            <Tooltip
              title={
                <span style={{ fontSize: 13 }}>
                  提示：请填写蜂鸟地图的地图ID，部分功能在填写后在预览页面可以查看！！！
                  <br />
                  <br />
                  <u>
                    小提示：例如比例尺，角度功能可以先填写，再填上ID，就可以查看！！！
                    其他功能在填写之前操作可能会提示错误。
                  </u>
                </span>
              }
            >
              提示： <Icon type="question-circle" />
            </Tooltip>
          }
        />
        <Form.Item label={'地图库url'} {...formItemLayout}>
          {getFieldDecorator(`${activeKey}.mapServerURL`, {
            initialValue: reap(
              style[activeKey],
              'mapServerURL',
              'https://3dl.dfocus.top/api/static/maps',
            ),
          })(<Input style={{ width: '100%' }} />)}
        </Form.Item>

        <Form.Item label={'地图主题url'} {...formItemLayout}>
          {getFieldDecorator(`${activeKey}.mapThemeURL`, {
            initialValue: reap(
              style[activeKey],
              'mapThemeURL',
              'https://3dl.dfocus.top/api/static/themes',
            ),
          })(<Input style={{ width: '100%' }} />)}
        </Form.Item>
        <Form.Item label={'地图ID'} {...formItemLayout}>
          {getFieldDecorator(`${activeKey}.mapId`, {
            initialValue: reap(style[activeKey], 'mapId', undefined),
            rules: [
              {
                min: 1,
                message: '不能为空',
              },
            ],
          })(<Input placeholder="请填写地图ID" />)}
        </Form.Item>
      </Panel>

      <Panel header="地图加载完的背景色">
        <Form.Item label={'地图背景颜色'} {...formItemLayout}>
          {getFieldDecorator(`${activeKey}.backgroundColor`, {
            initialValue: reap(style[activeKey], 'backgroundColor', '#ffffff'),
          })(<InputColor />)}
        </Form.Item>

        <Form.Item label={'透明度'} {...formItemLayout}>
          {getFieldDecorator(`${activeKey}.opacity`, {
            initialValue: reap(style[activeKey], 'opacity', 1),
          })(<InputNumber step={0.01} min={0} max={1} style={{ width: '100%' }} />)}
        </Form.Item>

        <div style={{ padding: 20 }}>{<Button onClick={clickBack}>恢复为页面背景色</Button>}</div>
      </Panel>

      <Panel header="地图基本配置">
        <Alert
          type="success"
          message={
            <Tooltip
              style={{ padding: '0 12' }}
              title={
                <span style={{ fontSize: 13 }}>
                  提示：此功能在调试过程中需要打开预览页面才能看到效果。
                </span>
              }
            >
              提示： <Icon type="question-circle" />
            </Tooltip>
          }
        />

        <Form.Item label={'默认比例尺'} {...formItemLayout}>
          {getFieldDecorator(`${activeKey}.defaultMapScale`, {
            initialValue: reap(style[activeKey], 'defaultMapScale', 200),
          })(<InputNumber step={10} min={1} style={{ width: '100%' }} />)}
        </Form.Item>

        <Form.Item label={'默认聚焦楼层'} {...formItemLayout}>
          {getFieldDecorator(`${activeKey}.defaultFocusGroup`, {
            initialValue: reap(style[activeKey], 'defaultFocusGroup', 1),
          })(<InputNumber style={{ width: '100%' }} />)}
        </Form.Item>

        <Form.Item className={styles.Dividingine} label="按钮宽度" {...formItemLayout}>
          {getFieldDecorator(`${activeKey}.btnWidth`, {
            initialValue: reap(style[activeKey], 'btnWidth', 42),
          })(<InputNumber style={{ width: '100%' }} />)}
        </Form.Item>

        <Form.Item label="按钮高度" {...formItemLayout}>
          {getFieldDecorator(`${activeKey}.btnHeight`, {
            initialValue: reap(style[activeKey], 'btnHeight', 42),
          })(<InputNumber style={{ width: '100%' }} />)}
        </Form.Item>

        <Form.Item label="按钮圆角" {...formItemLayout}>
          {getFieldDecorator(`${activeKey}.btnRadius`, {
            initialValue: reap(style[activeKey], 'btnRadius', 0),
          })(<InputNumber style={{ width: '100%' }} />)}
        </Form.Item>

        <Form.Item label="按钮边框" {...formItemLayout}>
          {getFieldDecorator(`${activeKey}.btnBorder`, {
            initialValue: reap(style[activeKey], 'btnBorder', 'none'),
          })(<Input />)}
        </Form.Item>

        <Form.Item label="按钮是否阴影" {...formItemLayout}>
          {getFieldDecorator(`${activeKey}.btnShadow`, {
            initialValue: reap(style[activeKey], 'btnShadow', true),
            valuePropName: 'checked',
          })(<Switch />)}
        </Form.Item>

        <Form.Item label="按钮阴影数值" {...formItemLayout}>
          {getFieldDecorator(`${activeKey}.btnBoxShadow`, {
            initialValue: reap(style[activeKey], 'btnBoxShadow', 'none'),
          })(<Input />)}
        </Form.Item>

        <Form.Item label="按钮字体大小" {...formItemLayout}>
          {getFieldDecorator(`${activeKey}.btnFontSize`, {
            initialValue: reap(style[activeKey], 'btnFontSize', 12),
          })(<InputNumber style={{ width: '100%' }} min={12} />)}
        </Form.Item>

        <Form.Item label="按钮字体粗细" {...formItemLayout}>
          {getFieldDecorator(`${activeKey}.btnFontWeight`, {
            initialValue: reap(style[activeKey], 'btnFontWeight', 400),
          })(<InputNumber style={{ width: '100%' }} min={300} step={100} />)}
        </Form.Item>

        <Form.Item label={'按钮字体颜色'} {...formItemLayout}>
          {getFieldDecorator(`${activeKey}.btnFontColor`, {
            initialValue: reap(style[activeKey], 'btnFontColor', 'rbga(30,130,250,1)'),
          })(<InputColor />)}
        </Form.Item>

        <Form.Item label={'按钮高亮字体颜色'} {...formItemLayout}>
          {getFieldDecorator(`${activeKey}.btnHighlightFontColor`, {
            initialValue: reap(style[activeKey], 'btnHighlightFontColor', undefined),
          })(<InputColor />)}
        </Form.Item>

        <Form.Item label={'按钮背景颜色'} {...formItemLayout}>
          {getFieldDecorator(`${activeKey}.btnBackgroundColor`, {
            initialValue: reap(style[activeKey], 'btnBackgroundColor', 'rgba(255,255,255,1)'),
          })(<InputColor />)}
        </Form.Item>

        <Form.Item label="按钮是否有背景色" {...formItemLayout}>
          {getFieldDecorator(`${activeKey}.btnBackgroundColorBool`, {
            valuePropName: 'checked',
            initialValue: reap(style[activeKey], 'btnBackgroundColorBool', true),
          })(<Switch />)}
        </Form.Item>

        <Form.Item label={'按钮高亮背景颜色'} {...formItemLayout}>
          {getFieldDecorator(`${activeKey}.btnHighlightBackgroundColor`, {
            initialValue: reap(style[activeKey], 'btnHighlightBackgroundColor', undefined),
          })(<InputColor />)}
        </Form.Item>
      </Panel>

      <Panel header="地图导航配置">
        <Form.Item label="路径指引" {...formItemLayout}>
          {getFieldDecorator(`${activeKey}.navigation`, {
            initialValue: reap(style[activeKey], 'navigation', false),
            valuePropName: 'checked',
          })(<Switch checkedChildren="开启" unCheckedChildren="关闭" />)}
        </Form.Item>

        <Form.Item label="指引图标大小" {...formItemLayout}>
          {getFieldDecorator(`${activeKey}.iconSize`, {
            initialValue: reap(style[activeKey], 'iconSize', 50),
            valuePropName: 'checked',
          })(<InputNumber min={10} />)}
        </Form.Item>

        <Form.Item
          label={
            <Tooltip
              style={{ padding: '0 12' }}
              title={<span style={{ fontSize: 12 }}>起点配置优先级递减</span>}
            >
              公共默认起点 <Icon type="question-circle" />
            </Tooltip>
          }
          {...formItemLayout}
          className={styles.Dividingine}
        >
          {getFieldDecorator(`${activeKey}.defaultStatus`, {
            initialValue: reap(style[activeKey], 'defaultStatus', false),
            valuePropName: 'checked',
          })(<Switch checkedChildren="开启" unCheckedChildren="关闭" />)}
        </Form.Item>

        {defaultStatus && (
          <Form.Item {...formItemLayout}>
            {getFieldDecorator(`${activeKey}.defaultStart`, {
              initialValue: reap(style[activeKey], 'defaultStart', {}),
            })(<DefaultStartPoint Form={Form} />)}
          </Form.Item>
        )}

        <Form.Item label="单独默认起点" {...formItemLayout} className={styles.Dividingine}>
          {getFieldDecorator(`${activeKey}.defaultOneStatus`, {
            initialValue: reap(style[activeKey], 'defaultOneStatus', false),
            valuePropName: 'checked',
          })(<Switch checkedChildren="开启" unCheckedChildren="关闭" />)}
        </Form.Item>
        <span>每层单独设置起点</span>

        {defaultOneStatus && (
          <Form.Item label={'导航起点组'} {...formItemLayout}>
            {getFieldDecorator(`${activeKey}.startGroup`, {
              initialValue: reap(style[activeKey], 'startGroup', []),
            })(<StartGroup Form={Form} updateStyle={updateStyle} style={style} />)}
          </Form.Item>
        )}

        <Alert
          type="success"
          message={
            <Tooltip
              style={{ padding: '0 12' }}
              title={
                <span style={{ fontSize: 13 }}>
                  动态起点，终点都是根据数据字段里面的 StartPoint / EndPoint 来设置。
                </span>
              }
            >
              提示： <Icon type="question-circle" />
            </Tooltip>
          }
        />

        <Form.Item label="动态起点" {...formItemLayout}>
          {getFieldDecorator(`${activeKey}.dynamicStartPoint`, {
            initialValue: reap(style[activeKey], 'dynamicStartPoint', false),
            valuePropName: 'checked',
          })(<Switch checkedChildren="开启" unCheckedChildren="关闭" />)}
        </Form.Item>

        <Form.Item label="动态终点" {...formItemLayout}>
          {getFieldDecorator(`${activeKey}.dynamicEndPoint`, {
            initialValue: reap(style[activeKey], 'dynamicEndPoint', false),
            valuePropName: 'checked',
          })(<Switch checkedChildren="开启" unCheckedChildren="关闭" />)}
        </Form.Item>
      </Panel>

      <Panel header="地图操作相关配置">
        <Alert
          type="success"
          message={
            <Tooltip
              title={
                <span style={{ fontSize: 13 }}>
                  提示：此功能在调试过程中需要打开预览页面才能看到效果。
                </span>
              }
            >
              提示： <Icon type="question-circle" />
            </Tooltip>
          }
        />

        <Form.Item label="支持单击模型高亮" {...formItemLayout}>
          {getFieldDecorator(`${activeKey}.modelSelectedEffect`, {
            initialValue: reap(style[activeKey], 'modelSelectedEffect', false),
            valuePropName: 'checked',
          })(<Switch />)}
        </Form.Item>

        <Form.Item label="设置能否缩放" {...formItemLayout}>
          {getFieldDecorator(`${activeKey}.enableMapPinch`, {
            initialValue: reap(style[activeKey], 'enableMapPinch', true),
            valuePropName: 'checked',
          })(<Switch />)}
        </Form.Item>

        <Form.Item label="设置能否ƒ移动模型" {...formItemLayout}>
          {getFieldDecorator(`${activeKey}.enableMapPan`, {
            initialValue: reap(style[activeKey], 'enableMapPan', true),
            valuePropName: 'checked',
          })(<Switch />)}
        </Form.Item>

        <Form.Item label="设置能否√旋转模型" {...formItemLayout}>
          {getFieldDecorator(`${activeKey}.enableMapRotate`, {
            initialValue: reap(style[activeKey], 'enableMapRotate', true),
            valuePropName: 'checked',
          })(<Switch />)}
        </Form.Item>

        <Form.Item label="设置能否≈倾斜模型" {...formItemLayout}>
          {getFieldDecorator(`${activeKey}.enableMapIncline`, {
            initialValue: reap(style[activeKey], 'enableMapIncline', true),
            valuePropName: 'checked',
          })(<Switch />)}
        </Form.Item>
      </Panel>

      <Panel header="地图角度配置">
        <Form.Item label={'地图角度设置'} {...formItemLayout} validateTrigger={['onBlur']}>
          {getFieldDecorator(`${activeKey}.angle`, {
            initialValue: reap(style[activeKey], 'angle', 0),
          })(<InputNumber min={-360} max={360} />)}
        </Form.Item>

        <Form.Item label={'地图中心设置'} {...formItemLayout}>
          {getFieldDecorator(`${activeKey}.center`, {
            initialValue: reap(style[activeKey], 'center', []),
          })(<ButtonGroup Form={Form} updateStyle={updateStyle} style={style} />)}
        </Form.Item>
      </Panel>

      <Panel disabled={!mapId} header="楼层按钮设置">
        <Form.Item label="楼层切换" {...formItemLayout}>
          {getFieldDecorator(`${activeKey}.showFloor`, {
            initialValue: reap(style[activeKey], 'showFloor', true),
            valuePropName: 'checked',
          })(<Switch />)}
        </Form.Item>

        <Form.Item label="是否为星巴克定制楼层样式" {...formItemLayout}>
          {getFieldDecorator(`${activeKey}.isStarbucks`, {
            initialValue: reap(style[activeKey], 'isStarbucks', false),
            valuePropName: 'checked',
          })(<Switch />)}
        </Form.Item>

        {isStarbucks && (
          <Form.Item label="背景图片" {...formItemLayout}>
            {getFieldDecorator(`${activeKey}.floorBgImage`, {
              initialValue: reap(style[activeKey], 'floorBgImage', undefined),
            })(<Input />)}
          </Form.Item>
        )}

        <Form.Item label="楼层按钮所在方位" {...formItemLayout}>
          {getFieldDecorator(`${activeKey}.buttonPosition`, {
            initialValue: reap(style[activeKey], 'buttonPosition', 'RIGHT_BOTTOM'),
          })(
            <Radio.Group>
              <Radio style={TAL} value="LEFT_TOP">
                左上
              </Radio>
              <Radio style={TAL} value="LEFT_BOTTOM">
                左下
              </Radio>
              <Radio style={TAL} value="RIGHT_TOP">
                右上
              </Radio>
              <Radio style={TAL} value="RIGHT_BOTTOM">
                右下
              </Radio>
            </Radio.Group>,
          )}
        </Form.Item>

        <Form.Item label="楼层按钮左右边距" {...formItemLayout}>
          {getFieldDecorator(`${activeKey}.distanceX`, {
            initialValue: reap(style[activeKey], 'distanceX', 0),
          })(<InputNumber style={{ width: '100%' }} />)}
        </Form.Item>

        <Form.Item label="楼层按钮上下边距" {...formItemLayout}>
          {getFieldDecorator(`${activeKey}.distanceY`, {
            initialValue: reap(style[activeKey], 'distanceY', 50),
          })(<InputNumber style={{ width: '100%' }} />)}
        </Form.Item>

        <Form.Item label="默认展开楼层" {...formItemLayout}>
          {getFieldDecorator(`${activeKey}.showBtnCount`, {
            initialValue: reap(style[activeKey], 'showBtnCount', 7),
          })(<InputNumber style={{ width: '100%' }} />)}
        </Form.Item>
      </Panel>

      <Panel disabled={!mapId} header="2D/3D按钮设置">
        <Form.Item label="2D/3D按钮" {...formItemLayout}>
          {getFieldDecorator(`${activeKey}.show3D`, {
            initialValue: reap(style[activeKey], 'show3D', true),
            valuePropName: 'checked',
          })(<Switch />)}
        </Form.Item>

        <Form.Item label="2D/3D按钮图标目录地址" {...formItemLayout}>
          {getFieldDecorator(`${activeKey}.imgURL`, {
            initialValue: reap(style[activeKey], 'imgURL', undefined),
          })(<Input />)}
        </Form.Item>

        <Form.Item label="3D按钮所在方位" {...formItemLayout}>
          {getFieldDecorator(`${activeKey}.buttonPosition3D`, {
            initialValue: reap(style[activeKey], 'buttonPosition3D', 'RIGHT_BOTTOM'),
            // valuePropName: 'checked',
          })(
            <Radio.Group>
              <Radio style={TAL} value="LEFT_TOP">
                左上
              </Radio>
              <Radio style={TAL} value="LEFT_BOTTOM">
                左下
              </Radio>
              <Radio style={TAL} value="RIGHT_TOP">
                右上
              </Radio>
              <Radio style={TAL} value="RIGHT_BOTTOM">
                右下
              </Radio>
            </Radio.Group>,
          )}
        </Form.Item>

        <Form.Item label="3D按钮左右边距" {...formItemLayout}>
          {getFieldDecorator(`${activeKey}.distanceX3D`, {
            initialValue: reap(style[activeKey], 'distanceX3D', 0),
          })(<InputNumber style={{ width: '100%' }} />)}
        </Form.Item>

        <Form.Item label="3D按钮上下边距" {...formItemLayout}>
          {getFieldDecorator(`${activeKey}.distanceY3D`, {
            initialValue: reap(style[activeKey], 'distanceY3D', 0),
          })(<InputNumber style={{ width: '100%' }} />)}
        </Form.Item>
      </Panel>

      <Panel disabled={!mapId} header="地图指北针设置">
        <Form.Item label="地图指北针" {...formItemLayout}>
          {getFieldDecorator(`${activeKey}.showCompass`, {
            initialValue: reap(style[activeKey], 'showCompass', false),
            valuePropName: 'checked',
          })(<Switch />)}
        </Form.Item>
      </Panel>

      <Panel disabled={!mapId} header="地图重置">
        <Form.Item label="地图重置按钮" {...formItemLayout}>
          {getFieldDecorator(`${activeKey}.showReset`, {
            initialValue: reap(style[activeKey], 'showReset', false),
            valuePropName: 'checked',
          })(<Switch />)}
        </Form.Item>

        <Form.Item label="地图重置按钮图标链接" {...formItemLayout}>
          {getFieldDecorator(`${activeKey}.resetUrl`, {
            initialValue: reap(style[activeKey], 'resetUrl', undefined),
          })(<Input />)}
        </Form.Item>

        <Form.Item label="地图重置Padding" {...formItemLayout}>
          {getFieldDecorator(`${activeKey}.resetPadding`, {
            initialValue: reap(style[activeKey], 'resetPadding', 0),
          })(<InputNumber style={{ width: '100%' }} />)}
        </Form.Item>

        <Form.Item label="地图重置按钮所在方位" {...formItemLayout}>
          {getFieldDecorator(`${activeKey}.resetPosition`, {
            initialValue: reap(style[activeKey], 'resetPosition', 'LEFT_BOTTOM'),
          })(
            <Radio.Group>
              <Radio style={TAL} value="LEFT_TOP">
                左上
              </Radio>
              <Radio style={TAL} value="LEFT_BOTTOM">
                左下
              </Radio>
              <Radio style={TAL} value="RIGHT_TOP">
                右上
              </Radio>
              <Radio style={TAL} value="RIGHT_BOTTOM">
                右下
              </Radio>
            </Radio.Group>,
          )}
        </Form.Item>

        <Form.Item label="地图重置按钮左右边距" {...formItemLayout}>
          {getFieldDecorator(`${activeKey}.resetPositionX`, {
            initialValue: reap(style[activeKey], 'resetPositionX', 0),
          })(<InputNumber style={{ width: '100%' }} />)}
        </Form.Item>

        <Form.Item label="地图重置按钮上下边距" {...formItemLayout}>
          {getFieldDecorator(`${activeKey}.resetPositionY`, {
            initialValue: reap(style[activeKey], 'resetPositionY', 0),
          })(<InputNumber style={{ width: '100%' }} />)}
        </Form.Item>

        <Form.Item label="支持默认时间重置" {...formItemLayout}>
          {getFieldDecorator(`${activeKey}.resetStatus`, {
            initialValue: reap(style[activeKey], 'resetStatus', false),
            valuePropName: 'checked',
          })(<Switch />)}
        </Form.Item>

        {resetStatus && (
          <Form.Item label="默认重置时间（s）" {...formItemLayout}>
            {getFieldDecorator(`${activeKey}.resetTime`, {
              initialValue: reap(style[activeKey], 'resetTime', 10),
            })(<InputNumber step={30} min={10} max={1440} style={{ width: '100%' }} />)}
          </Form.Item>
        )}
      </Panel>

      <Panel header="地图数据相关操作">
        <Alert
          type="success"
          message={
            <Tooltip
              title={
                <span style={{ fontSize: 13 }}>
                  提示：此功能是用于已预订的是否可以点击弹出 Modal 等操作， true 可以操作，
                  false：已预订数据不能操作，不能显示弹窗等！！！
                </span>
              }
            >
              提示： <Icon type="question-circle" />
            </Tooltip>
          }
        />

        <Form.Item label="已预订数据是否可以操作" {...formItemLayout}>
          {getFieldDecorator(`${activeKey}.OccStatus`, {
            initialValue: reap(style[activeKey], 'OccStatus', false),
            valuePropName: 'checked',
          })(<Switch />)}
        </Form.Item>
      </Panel>
      <Panel header="容器配置">
        <Form.Item label="容器ID" {...formItemLayout}>
          {getFieldDecorator(`${activeKey}.containerId`, {
            initialValue: reap(style[activeKey], 'containerId', null),
          })(<Input />)}
        </Form.Item>
      </Panel>
    </Collapse>
  );
}

export default Form.create({
  onFieldsChange: props => {
    const { form, style, updateStyle, activeKey } = props;
    const { getFieldsValue } = form;
    const newValues = getFieldsValue();
    updateStyle({ ...style, ...newValues, activeKey });
  },
})(PanelForm);
