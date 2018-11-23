import mockjs from 'mockjs';
import { getRule, postRule } from './mock/rule';
import { getComplaints, getComplaintDetail } from './mock/complaint';
import { getActivities, getNotice, getFakeList } from './mock/api';
import { getFakeChartData } from './mock/chart';
import { imgMap } from './mock/utils';
import { getProfileBasicData } from './mock/profile';
import { getProfileAdvancedData } from './mock/profile';
import { getNotices } from './mock/notices';
import { getOrders } from './mock/order';
import { format, delay } from 'roadhog-api-doc';

// 是否禁用代理
const noProxy = process.env.NO_PROXY === 'true';

// 代码中会兼容本地 service mock 以及部署站点的静态数据
const proxy = {
  // 支持值为 Object 和 Array
  'GET /v1/mtm/currentUser': {
    $desc: "获取当前用户接口",
    $params: {
      pageSize: {
        desc: '分页',
        exp: 2,
      },
    },
    $body: {
      name: 'Serati Ma',
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
      userid: '00000001',
      notifyCount: 12,
    },
  },
  // GET POST 可省略
  'GET /v1/mtm/users': [{
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
  }, {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
  }, {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
  }],
  // 'GET /v1/mtm/project/notice': getNotice,
  // 'GET /v1/mtm/activities': getActivities,
  'GET /v1/mtm/order_complaints': getComplaints,
  'GET /v1/mtm/order_complaint':{
    $params: {
      id: {
        desc: '订单号',
        exp: 2,
      },
    },
    $body: getComplaintDetail
  },
  // 'GET /v1/mtm/rule': getRule,
  // 'POST /v1/mtm/rule': {
  //   $params: {
  //     pageSize: {
  //       desc: '分页',
  //       exp: 2,
  //     },
  //   },
  //   $body: postRule,
  // },
  // 'POST /v1/mtm/forms': (req, res) => {
  //   res.send({ message: 'Ok' });
  // },
  // 'GET /v1/mtm/tags': mockjs.mock({
  //   'list|100': [{ name: '@city', 'value|1-100': 150, 'type|0-2': 1 }]
  // }),
  // 'GET /v1/mtm/fake_list': getFakeList,
  // 'GET /v1/mtm/fake_chart_data': getFakeChartData,
  // 'GET /v1/mtm/profile/basic': getProfileBasicData,
  // 'GET /v1/mtm/profile/advanced': getProfileAdvancedData,
  // 'POST /v1/mtm/login/account': (req, res) => {
  //   const { password, userName, type } = req.body;
  //   res.send({
  //     status: password === '888888' && userName === 'admin' ? 'ok' : 'error',
  //     type,
  //   });
  // },
  // 'POST /v1/mtm/register': (req, res) => {
  //   res.send({ status: 'ok' });
  // },
  // 'GET /v1/mtm/notices': getNotices,
  'GET /api/financial':  mockjs.mock({
    'fiat_exchange_object_list|20': [{ 'index|+1':1,'currency_code|+1': 88, 'usd_revenue|1-100': 150 }],
  }),
  'GET /api/financialBTC':  mockjs.mock({
    'digital_exchange_object_list|20': [{ 'index|+1':1,'currency_code|+1': 111, 'amount|100-200': 150 }],
  }),
  'GET /api/financialNet':  mockjs.mock({
    'network_fee_oject_list|20': [{ 'index|+1':1,'currency_code|+1': 333, 'customer_pay_mobi_fee|40-100': 2000 , 'mobi_pay_network_fee|1-100': 550 , 'revenue|1-5': 990 }],
  }),
    
};

export default noProxy ? {} : delay(proxy, 1000);
