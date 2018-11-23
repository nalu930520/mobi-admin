const menuData = [
  {
    name: 'Mobi C2C',
    icon: 'swap',
    path: 'c2c',
    show: true,
    children: [
      {
        name: '个人信息',
        path: 'customer/:id',
        icon: 'user',
        show: false,
        permissionUrl: '/v1/mtm/customer_search',
      },
      {
        name: '控制台',
        icon: 'dashboard',
        path: 'dashboard',
        show: true,
        permissionUrl: '/v1/mtm/customer_search',
      },
      {
        name: '广告列表',
        path: 'advertising-list',
        icon: 'team',
        show: true,
        permissionUrl: '/v1/mtm/ads',
      },
      {
        name: '广告详情',
        path: 'advertising-detail/:advertisingId',
        show: false,
      },
      {
        name: '订单列表',
        icon: 'tags-o',
        show: true,
        path: 'order-list',
        permissionUrl: '/v1/mtm/orders',
      },
      {
        name: '订单详情',
        show: false,
        path: 'order-detail/:orderId',
      },
      {
        name: '申诉表格',
        icon: 'solution',
        path: 'complaint-table',
        show: true,
        permissionUrl: '/v1/mtm/order_complaints',
      },
      {
        name: '申诉详情',
        path: 'complaint-details/:id',
        show: false,
      },
      {
        name: '设置',
        icon: 'setting',
        path: 'setting',
        show: true,
        permissionUrl: '/v1/mtm/system_setting',
      },
    ],
  },
  {
    name: '平台资产管理',
    icon: 'home',
    path: 'assets-management',
    show: true,
    children: [
      {
        name: '当前资产概览',
        path: 'dashboard',
        show: true,
        permissionUrl: '/v1/dashboard/index',
      },
      {
        name: '每日资产变更',
        path: 'daily-assets-change',
        show: true,
        permissionUrl: '/v1/dashboard/asset_change',
      },
      {
        name: '汇率概览',
        path: 'rate-view',
        show: true,
        permissionUrl: '/v1/dashboard/rate',
      },
      {
        name: '每日货币兑换总量变更',
        path: 'daily-currency-exchange-change',
        show: true,
        permissionUrl: '/v1/dashboard/exchange_flow',
      },
      {
        name: '货币兑换交易记录',
        path: 'currency-exchange-history',
        show: true,
        permissionUrl: '/v1/dashboard/exchange_transaction_recode',
      },
    ],
  },
  {
    name: '用户管理',
    icon: 'user',
    path: 'user-management',
    show: true,
    children: [
      {
        name: '用户列表',
        path: 'user-list',
        show: true,
        permissionUrl: '/v1/customers_search',
      },
      {
        name: '详细信息',
        path: 'user-detail/:id',
        show: false,
      },
    ],
  },
  {
    name: '交易管理',
    icon: 'profile',
    path: 'trade-management',
    show: true,
    children: [
      {
        name: '全部交易',
        path: 'allTransaction',
        show: true,
        permissionUrl: '/v1/transaction',
      },
      {
        name: '全部交易详情',
        path: 'allTransaction-details/:id',
        show: false,
      },
      {
        name: 'On-chain收发',
        path: 'onchainTransaction',
        show: true,
        permissionUrl: '/v1/transaction/onchain',
      },
      {
        name: 'On-chain收发详情',
        path: 'onchainTransaction-details/:id',
        show: false,
      },
      {
        name: '货币兑换交易记录',
        path: 'exchangeTransaction',
        show: true,
        permissionUrl: '/v1/transaction/exchange',
      },
      {
        name: '货币兑换详情',
        path: 'exchangeTransaction-details/:id',
        show: false,
      },
      {
        name: 'Mobi 转账',
        path: 'mobiTransaction',
        show: true,
        permissionUrl: '/v1/transaction/mobi',
      },
      {
        name: 'Mobi 转账详情',
        path: 'mobiTransaction-details/:id',
      },
    ],
  },
  {
    name: '对冲管理',
    icon: 'bank',
    show: true,
    path: 'hedging',
    children: [
      {
        name: '实时监控',
        show: true,
        path: 'monitor',
        permissionUrl: '/v1/hedge/hedge_monitor',
      },
      {
        name: '对冲记录',
        show: true,
        path: 'hedging-record/:currency',
        permissionUrl: '/v1/hedge/hedge_records',
      },
      {
        name: '设置',
        show: true,
        path: 'setting',
        permissionUrl: '/v1/hedge/hedge_platform',
      },
    ],
  },
  {
    name: '财务管理',
    icon: 'pay-circle-o',
    path: 'financial',
    show: true,
    children: [
      {
        name: '财务报表',
        show: true,
        path: 'financialList',
        permissionUrl: '/v1/financial/fiat/exchange',
      }, {
        name: '审计报表',
        show: true,
        path: 'auditReport',
        permissionUrl: '/v1/assets',
      },
    ],
  },
  {
    name: '现金充提',
    icon: 'swap',
    path: 'cashCharge',
    show: true,
    children: [
      {
        name: '充值请求',
        show: true,
        path: 'deposit',
        permissionUrl: '/v1/deposit/list',
      },
      {
        name: '新增充值',
        show: false,
        path: 'addDeposit',
        permissionUrl: '/v1/deposit/detail',
      },
      {
        name: '提现请求',
        show: true,
        path: 'widthdraw',
        permissionUrl: '/v1/withdraw/list',
      },
      {
        name: '新增提现',
        show: false,
        path: 'addWidthdraw',
        permissionUrl: '/v1/withdraw/detail',
      },
    ],
  },
  {
    name: '币丰堂',
    icon: 'pay-circle-o',
    path: 'yubibao',
    show: true,
    children: [
      {
        name: '转入转出记录',
        show: true,
        path: 'recording',
        permissionUrl: '/yub/web/rate/list',
      },
      {
        name: '币丰堂设置',
        show: false,
        path: 'settings',
        permissionUrl: '/yub/web/daily/setting',
      },
    ],
  },
  {
    name: '后台管理',
    icon: 'tool',
    path: 'back-management',
    show: true,
    children: [
      {
        name: '后台权限',
        show: true,
        path: 'auth',
        children: [
          {
            name: '用户权限列表',
            show: true,
            path: 'userAuthList',
            permissionUrl: '/v1/admin_users',
          },
          {
            name: '角色群组列表',
            show: false,
            path: 'grouproleList',
          },
          {
            name: '群组权限列表',
            show: false,
            path: 'groupAuthList',
          },
          {
            name: '添加/编辑群组',
            show: true,
            path: 'addOrEditGroup',
            permissionUrl: '/v1/admin_role',
            permissionMethod: 'POST', // todo
          },
          {
            name: '添加/编辑权限',
            show: false,
            path: 'addOrEditRole/:roleName',
          },
        ],
      },
      {
        name: '后台日志',
        show: true,
        path: 'log',
        permissionUrl: '/v1/operation_logs',
      },
      {
        name: '后台设置',
        show: true,
        path: 'setting',
        permissionUrl: '/v1/mtm/system_setting',
      },
    ],
  },
  {
    name: '商户管理',
    icon: 'pay-circle-o',
    path: 'bussiness',
    show: true,
    children: [
      {
        name: '商户列表',
        show: true,
        path: 'businessList',
        permissionUrl: '/business/platform_info',
      },
      {
        name: '商户详情',
        path: 'bussniessDetail/:id',
        show: false,
      },
      {
        name: '设置',
        path: 'bussniessSettings',
        permissionUrl: '/business/setting',
        show: true,
      },
    ],
  },
];

function formatter(data, parentPath = '/', permissionApi, auth = true) {
  const permissionInfo = permissionUrl => permissionApi.find(permissionData => permissionData.endpoint === permissionUrl);
  return data.map((item) => {
    let { path } = item;
    path = parentPath + item.path;
    const result = {
      ...item,
      path,
      authority: auth || (permissionInfo(item.permissionUrl) ? permissionInfo(item.permissionUrl).permission : false),
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, permissionApi, false);
    }
    return result;
  });
}

function fiterNotShow(data) {
  return data.filter((item) => {
    const result = item;
    if (item.children) {
      result.children = fiterNotShow(item.children);
    }
    return item.show === true;
  });
}

export const getMenuData = permissionApi => formatter(fiterNotShow(menuData), '', permissionApi);
