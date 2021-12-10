/**
 * border => 边框素材
 */
import BorderBox from '../../../../assets/border/border-2-1.png';
import { filterObj } from '../../../../helpers/utils';
import { reap } from '../../../../components/SafeReaper';
import { borderSettingEmus } from '../../../../helpers/materialconfig';

export default props => {
  const { style } = props;
  const _style = filterObj(style, ('', null, undefined));
  const borderSetting = reap(_style, 'borderSetting', borderSettingEmus['internal']);
  const backgroundColor = reap(_style, 'backgroundColor', '#a22bb1');
  const borderColor = reap(_style, 'borderColor', '#9000FF');
  const borderWidth = reap(_style, 'borderWidth', 2);
  const filter = reap(_style, 'filter', 0);
  const borderStyle = reap(_style, 'borderStyle', 'solid');
  const borderRadius = reap(_style, 'borderRadius', 0);
  const borderImageSource = reap(_style, 'borderImageSource', BorderBox);

  // 无的样式
  const borderNone = {
    backgroundClip: 'padding-box',
    filter: 'blur(0px)',
    backgroundColor,
    height: '100%',
    borderRadius,
  };
  // 简单边框
  const borderSimple = {
    backgroundClip: 'padding-box',
    filter: `blur(${filter}px)`,
    borderWidth,
    borderStyle,
    borderRadius,
    height: '100%',
    borderColor,

    backgroundColor,
  };
  // 内置边框
  const borderInternal = {
    backgroundClip: 'padding-box',
    filter: 'blur(0px)',
    borderWidth: '10px',
    borderStyle: 'solid',
    borderRadius,
    borderImageSource,
    borderImageSlice: '10 fill',
    height: '100%',
    backgroundColor,
  };
  // 自定义边框
  const borderCustomize = {
    backgroundClip: 'padding-box',
    filter: 'blur(0px)',
    borderWidth: '10px',
    borderStyle: 'solid',
    borderRadius,
    borderImageSource: 'url(undefined)',
    borderImageSlice: '10 fill',
    height: '100%',
    backgroundColor,
  };

  const allStyle = {
    [borderSettingEmus['none']]: borderNone,
    [borderSettingEmus['simple']]: borderSimple,
    [borderSettingEmus['internal']]: borderInternal,
    [borderSettingEmus['customize']]: borderCustomize,
  };
  const finallyStyle = allStyle[borderSetting];

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <div
        style={finallyStyle}
        // style={{
        // ...style,
        // ...borderCustomize,
        // borderImageSource: `url(${BorderBox})`,
        // borderImageSlice: '10 fill',
        // borderWidth: 10,
        // height: '100%',
        // borderStyle: 'solid',
        // backgroundClip: 'padding-box',
        // filter: 'blur(0px)',
        // }}
      ></div>
    </div>
  );
};
