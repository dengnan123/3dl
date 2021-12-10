import {
  ScreenSvg,
  CompSvg,
  BaleSvg,
  UserSvg,
  LogSvg,
  ViewSvg,
  TemplateSvg,
  DataBase,
} from '@/assets/menu/index';

export const ALL_MENUS_TREE = [
  {
    name: '模板商城',
    path: '/template',
    icon: <TemplateSvg />,
    isAllPerm: true,
    key: 'template',
  },
  {
    name: '我的可视化',
    path: '/screen',
    icon: <ScreenSvg />,
    key: 'screen',
    children: [
      {
        name: '页面',
        path: '/screen/page',
        key: 'screenPage',
        feature: [
          // {
          //   name: '编辑',
          //   key: 'pageEdit',
          // },
          // {
          //   name: '删除',
          //   key: 'pageDeleted',
          // },
        ],
      },
      {
        name: '项目',
        path: '/screen/project',
        key: 'screenProject',
      },
      {
        name: 'Loading',
        path: '/screen/loading-temp',
        key: 'screenLoading',
      },
    ],
  },
  {
    name: '组件',
    path: '/comp-management',
    icon: <CompSvg />,
    key: 'components',
    children: [
      {
        name: '组件管理',
        path: '/comp-management/comp',
        key: 'componentsManagement',
      },
      {
        name: '主题库',
        path: '/comp-management/theme',
        key: 'componentsThemes',
      },
      {
        name: '主题编辑',
        path: '/comp-management/theme-edit',
        key: 'componentsThemeEdit',
      },
    ],
  },
  {
    name: '部署',
    path: '/release-center',
    icon: <BaleSvg />,
    key: 'release',
    children: [
      {
        name: '环境变量',
        path: '/release-center/env-config',
        key: 'releaseConfig',
      },
      {
        name: '启动脚本',
        path: '/release-center/startsh',
        key: 'releaseStart',
      },
      {
        name: '打包',
        path: '/release-center/bale',
        key: 'releaseBale',
      },
    ],
  },
  {
    name: '管理',
    path: '/member-management',
    sn: 'MEMBER_MAMAGEMENT',
    icon: <UserSvg />,
    isAdminPerm: true,
    key: 'management',
    children: [
      {
        name: '用户管理',
        path: '/member-management/member',
        key: 'memberManagement',
      },
      {
        name: '角色管理',
        path: '/member-management/role',
        key: 'memberRole',
      },
      {
        name: '静态资源',
        path: '/member-management/static',
        key: 'staticManagement',
      },
      // {
      //   name: '标签管理',
      //   path: '/member-management/tags',
      //   key: 'tagsManagement',
      // },
    ],
  },
  {
    name: '数据管理',
    path: '/data-management',
    sn: 'DATA_MAMAGEMENT',
    icon: <DataBase />,
    // isAdminPerm: true,
    key: 'dataManagement',
    children: [
      {
        name: 'MySQL',
        path: '/data-management/mysql',
        key: 'mysqlManagement',
      },
    ],
  },
  {
    name: '日志',
    path: '/log-management',
    icon: <LogSvg />,
    isAdminPerm: true,
    key: 'logs',
    children: [
      {
        name: '操作日志',
        path: '/log-management/operate',
        key: 'logsOperate',
      },
    ],
  },
  {
    name: '大屏秀',
    path: '/o/overview',
    icon: <ViewSvg />,
    isAllPerm: true,
    key: 'overview',
  },
];

export const notAdminMenu = features => {
  // const filtetPaths = [
  //   '/comp-management/comp',
  //   '/member-management',
  //   '/log-management',
  //   '/release-center/env-config',
  //   '/release-center/startsh',
  // ];
  const menus = [...ALL_MENUS_TREE];

  function traversal(data, featPermissions) {
    let menusArr = [];
    for (let i = 0; i < data.length; i++) {
      const { children, key, isAllPerm } = data[i];
      const permissions = featPermissions[key];
      if (isAllPerm) {
        menusArr.push(data[i]);
        continue;
      }

      if (!permissions) {
        continue;
      }

      if (permissions === 1) {
        menusArr.push(data[i]);
        continue;
      }

      if (children && children.length > 0) {
        const childrenArr = traversal(children, permissions);
        menusArr.push({ ...data[i], children: childrenArr });
      }
    }
    return menusArr;
  }
  const newMenus = traversal(menus, features);
  return newMenus;
};

// 获取有权限的页面path
export const notAdminMenuPath = features => {
  const menus = notAdminMenu(features);
  let pathArr = [];

  function quertPath(data) {
    for (let i = 0; i < data.length; i++) {
      const { children, path } = data[i];
      pathArr.push(path);
      if (children && children.length > 0) {
        quertPath(children);
      }
    }
  }

  quertPath(menus);

  return pathArr;
};

// 获取链接参数
export const queryParams = data => {
  if (!data) {
    return {};
  }
  let obj = {};
  data
    .replace('?', '')
    .split('&')
    .map(n => {
      const arr = n.split('=');
      obj[arr[0]] = arr[1];
      return n;
    });
  return obj;
};
