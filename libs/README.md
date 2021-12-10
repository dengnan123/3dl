# 大屏组件库

# 在开组组件的时候，分两部分，一个是组件本身，一个是组件的配置

# 每个组件的porps 里面有  data 和 style 两个参数
data组件可能用到的数据源
style 组件的属性配置

比如Text组件:
```
import React from 'react';
export default props => {
  const { style = {} } = props; // 会拿到props里面的style 来更改自己的样式
  const { text = '我是文本' } = style;
  return (
    <div
      style={{
        ...style,
      }}
    >
      {text}
    </div>
  );
};

```

# 开发完成后更改libs里面的index.js，把你开发的组件库引入进来
比如：
```
import ProgressLine from './ProgressLine';
import Text from './Text';
import Image from './Image';
import ECharts from './ECharts';
import Material from './Material';
import Table from './Table';

export default {
  ProgressLine,
  Text,
  Image,
  ...ECharts,
  ...Material,
  ...Table,
};

```


# 每个组件配置props里面有 updateStyle方法来更改属性
# 例子可以参考libs-config里面组件配置的写法
# 开发完成组件配置后 libs-config里面的index.js，把你开发的组件库配置引入进来

比如：
```
import Text from './TextConfig';
import Image from './ImageConfig';
import LineAndBarConfig from './LineAndBarConfig';
import Pie from './PieConfig';
import TableConfig from './TableConfig';
import MaterialConfig from './MaterialConfig';

const MaterialConfigHash = {
  Image: MaterialConfig,
  DividingLine: MaterialConfig,
  Circle: MaterialConfig,
  Oval: MaterialConfig,
  Rectangle: MaterialConfig,
  Arrow: MaterialConfig,
  BorderBox: MaterialConfig,
};

export default {
  Text,
  Image,
  Line: LineAndBarConfig,
  Bar: LineAndBarConfig,
  Table: TableConfig,
  Pie,
  ...MaterialConfigHash,
};


```
组件库打包 umd格式
```
npm run bur 
```
打包完都会输出到dist下面


# 地图颜色和状态相关
spaceStatus  会议室颜色状态
             1 => <font color='green'>绿色</font>
             2 => <font color='red'>红色</font>
             3 => <font color='yellow'>黄色</font>
             4 => <font color='blue'>蓝色</font>

spaceType    会议室类型
             1 => 工位
             2 => 会议室