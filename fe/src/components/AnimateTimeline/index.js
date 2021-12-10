import { Timeline, Tag } from 'antd';
import { getTagColors } from '@/helpers/tag';
import styles from './index.less';
const timelineArr = [
  {
    time: 1,
    comps: [
      {
        compName: '组件AS',
        id: '123',
        basicStyle:{
          inAnimate:{
            name:'淡入'
          },
          outAnimate:{
            name:'淡出'
          }
        }
      },
      {
        compName: '组件cccc',
        id: 'qwe',
        basicStyle:{
          inAnimate:{
            name:'旋转'
          },
          outAnimate:{
            name:'淡出'
          }
        }
      },
    ],
  },
  {
    time: 2,
    comps: [
      {
        compName: '强调组件',
        id: '123',
        basicStyle:{
          inAnimate:{
            name:'旋转'
          },
          outAnimate:{
            name:'闪退'
          }
        }
      },
    ],
  },
  {
    time: 3,
    comps: [
      {
        compName: 'AAEQ23123',
        id: '123',
        basicStyle:{
          inAnimate:{
            name:'旋转123123'
          },
          outAnimate:{
            name:'闪退'
          }
        }
      },
    ],
  },
];

const colors = getTagColors();
export default () => {
  return (
    <Timeline className={styles.wrap}>
      {timelineArr.map((v, index) => {
        const { comps, time } = v;
        return (
          <Timeline.Item>
            <div className={styles.item}>
              {comps.map(v => {
                return <Tag color={colors[index] || 'red'}>{v.compName}---{v?.basicStyle?.inAnimate?.name}</Tag>;
              })}
              <span className={styles.sec}>{time}s</span>
            </div>
          </Timeline.Item>
        );
      })}
    </Timeline>
  );
};
