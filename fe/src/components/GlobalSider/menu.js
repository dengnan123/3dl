import { ScreenSvg, CompSvg, BaleSvg, UserSvg, LogSvg, ViewSvg } from '@/assets/menu/index';

export const ALL_MENUS_TREE = [
  {
    name: '大屏',
    path: '/screen',
    icon: <ScreenSvg />,
    children: [
      {
        name: '页面',
        path: '/screen/page',
      },
      {
        name: '项目',
        path: '/screen/project',
      },
      {
        name: 'Loading',
        path: '/screen/loading-temp',
      },
    ],
  },
  {
    name: '组件',
    path: '/comp-management',
    icon: <CompSvg />,
    isAdminPerm: true,
    children: [
      {
        name: '组件管理',
        path: '/comp-management/comp',
      },
      {
        name: '主题库',
        path: '/comp-management/theme',
      },
      {
        name: '主题编辑',
        path: '/comp-management/theme-edit',
      },
    ],
  },
  {
    name: '部署',
    path: '/release-center',
    icon: <BaleSvg />,
    children: [
      {
        name: '环境变量',
        path: '/release-center/env-config',
      },
      {
        name: '启动脚本',
        path: '/release-center/startsh',
      },
      {
        name: '打包',
        path: '/release-center/bale',
      },
    ],
  },
  {
    name: '用户管理',
    path: '/member-management',
    icon: <UserSvg />,
    sn: 'MEMBER_MAMAGEMENT',
    isAdminPerm: true,
    children: [
      {
        name: '用户',
        path: '/member-management/member',
      },
      {
        name: '角色',
        path: '/member-management/role',
      },
    ],
  },
  {
    name: '日志',
    path: '/log-management',
    icon: <LogSvg />,
    children: [
      {
        name: '操作日志',
        path: '/log-management/operate',
      },
    ],
  },
  {
    name: '大屏秀',
    path: '/o/overview',
    icon: <ViewSvg />,
  },
];

export const notAdminMenu = () => {
  const filtetPaths = [
    '/comp-management/comp',
    '/member-management',
    '/log-management',
    '/release-center/env-config',
    '/release-center/startsh',
  ];
  const menus = [...ALL_MENUS_TREE];
  function traversal(data) {
    for (let i = 0; i < data.length; i++) {
      const { children, path } = data[i];
      if (filtetPaths.includes(path)) {
        data.splice(i, 1);
        i--;
      }
      if (children) {
        if (children.length > 0) {
          traversal(children);
        }
      }
    }
  }
  traversal(menus);
  return menus;
};
