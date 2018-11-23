import { getUrlParams } from './utils';

// mock tableListDataSource
const tableListDataSource = [];
for (let i = 0; i < 46; i += 1) {
  tableListDataSource.push({
    id: i,
    order_id: 1200034,
    created_at: new Date(`2017-07-${Math.floor(i / 2) + 1}`),
    claimant_id: 122, // 申诉发起方id
    claimant_email: 'abc@gmai.com', // 申诉发起方邮箱
    respondent_id: 124, // 被申诉id
    respondent_email: 'efg@gmai.com', // 被申诉邮箱
    fiat_currency_code: 'cny',
    fiat_amount: i * 1000, // 法币数量
  });
}

export function getComplaints(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url; // eslint-disable-line
  }

  const params = getUrlParams(url);

  let dataSource = [...tableListDataSource];

  if (params.sorter) {
    const s = params.sorter.split('_');
    dataSource = dataSource.sort((prev, next) => {
      if (s[1] === 'descend') {
        return next[s[0]] - prev[s[0]];
      }
      return prev[s[0]] - next[s[0]];
    });
  }

  if (params.status) {
    const status = params.status.split(',');
    let filterDataSource = [];
    status.forEach((s) => {
      filterDataSource = filterDataSource.concat(
        [...dataSource].filter(data => parseInt(data.status, 10) === parseInt(s[0], 10))
      );
    });
    dataSource = filterDataSource;
  }

  if (params.no) {
    dataSource = dataSource.filter(data => data.no.indexOf(params.no) > -1);
  }

  let pageSize = 10;
  if (params.pageSize) {
    pageSize = params.pageSize * 1;
  }

  const result = {
    list: dataSource,
    pagination: {
      total: dataSource.length,
      pageSize,
      current: parseInt(params.currentPage, 10) || 1,
    },
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export function getComplaintDetail(req, res) {
  const result = {
    order_id: 12938190,
    created_at: new Date('2017-07-01'),
    claimant_id: 123, // 申诉发起方
    claimant_email: '1239120@gmail.com', // 申诉发起方邮箱
    respondent_id: 12, // 被申诉人ID
    respondent_email: 'adsas1@gmail.com', // 被申诉人邮箱
    ref_id: 1023840, // 订单参考号
    fiat_currency_code: 'usd',
    fiat_amount: 12311, // 法币数量
    crypto_currency_code: 'eth',
    crypto_amount: 1203,
    details: [
      {
        uploader_id: 1, //  上传用户ID
        uploaer_type: 1, // 1: 申诉人, 2: 被申诉人
        item_type: 1, // 1: picture, 2: video, 3: text evidence
        content: '/qiniuyun?ajskdlfj',
        created_at: new Date('2017-07-01 10:20:00'),
      },
      {
        uploader_id: 2, //  上传用户ID
        uploaer_type: 1, // 1: 申诉人, 2: 被申诉人
        item_type: 1, // 1: picture, 2: video, 3: text evidence
        content: '/qiniuyun?ajskdlfj',
        created_at: new Date('2017-07-01 10:20:00'),
      },
    ], // 双方证据
    status: 0, // 申诉状态
  };

  if (res && res.json) {
    res.json(result);
  } else {
    return result;
  }
}

export default {
  getComplaints,
  getComplaintDetail,
};
