### Map 组件

#### 1. 日志

新建：swpan

组件更新日期：2020-10-12

使用：记录Map组件更新，修改，等主要功能...

版本：v 1.0.0  -->  v 2.0.0

> 版本号只用作说明组件的改动大小

#### 2. 功能：
1. 支持多地图配置，和地图基本操作配置。
  - 配置：新增Tabs标签，配置相关设置就好
  - 查看：本地调试需要配合React，调试工具修改props值查看，大屏使用，需要在链接后面添加参数activeKey，值为Number类型。
  - 默认屏蔽了地图的楼层，2D/3D，地图指北针，重置等按钮，因为在地图没渲染出来之前操作会导致地图渲染不成功，其他的比例尺，角度等基本配置仍然可以设置。

2. 支持多后端数据状态多相关操作
 - 在地图数据相关操作中，默认false，即关闭地图已预订工位的可点击交互事件。

#### 3. 数据

> JSON数据格式为 Array | Object

1. 数据格式

   | 键          | 值                   | 名称                                                | 是否必须 |
   | :---------- | :------------------- | --------------------------------------------------- | -------- |
   | id          | Number               | ID                                                  | X        |
   | fids         | Array                | 地图FID                                             | √        |
   | color       | String（16进制颜色） | 地图上显现的颜色                                    | X        |
   | spaceStatus | Number               | 工位颜色：（默认 1：绿色  2：红色  3:黄色  4:蓝色） | √        |
   | spaceType   | Number               | 工位类型 （默认 1: 工位， 2: 会议室,）              | X        |
   | startPoint  | Object               | 导航起点                                            | X        |
   | endPoint    | Object               | 导航终点                                            | X        |

   > 如果存在color字段会使用该字段对应的颜色，如果不存在会使用默认的颜色（分别对应的16进制颜色：'#80BA01'，'#F25022'，'#FFB902'，'#0240EF'）

2. 示例

```js
{
  "mapArray": [ // 地图
    {
      "id": 20,
      "fids": ["8690570201173", "8690570201171"], // 地图FID
      "color": "#64dabd",  // 对应颜色
      "spaceStatus": 1, // model状态
      "spaceType": 1 // model类型
    },
    {...}
  ],
  "startPoint": { // 默认起点坐标
    "options": {
      "x": 13514777.7115,
      "y": 3655086.1594,
      "groupID": 1,
      "url": "/assets/startPoint.png",
      "size": 50,
      "height": 2
    }
  },
  "endPoint": { // 默认终点坐标
    "options": {
      "x": 13514776.2995,
      "y": 3655086.1594,
      "groupID": 1,
      "url": "/assets/endPoint.png",
      "size": 50,
      "height": 2
    }
  }
}
```



> 说明：2020-10-01之前项目所使用的地图配置项在新地图配置中仍然可以使用，如果遇到报错，请检查问题，或者重新配置地图。