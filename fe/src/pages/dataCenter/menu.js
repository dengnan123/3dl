import BasicConfig from './components/BasicConfig'
import ProjectList from './components/ProjectList'

export const MENU_LIST = [
  {
    key: 'BasicConfig',
    label: '全局配置',
    render: () => <BasicConfig />,
  },
  {
    key: 'ProjectList',
    label: '项目列表',
    render: () => <ProjectList />,
  },
];
