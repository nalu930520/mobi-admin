import { make } from 'react-lens';

make('complaintReason', 'string', (content) => {
  let data = '-';
  switch (content) {
    case '1':
      data = '我已支付，卖家未放币未响应';
      break;
    case '2':
      data = '卖家拒绝交易';
      break;
    case '3':
      data = '其他，请在下方【文字说明】进行描述';
      break;
    case '101':
      data = '买家未付款未响应';
      break;
    case '102':
      data = '怀疑买家的支付存在欺诈';
      break;
    case '103':
      data = '买家未遵守交易条款';
      break;
    case '104':
      data = '其他，请在下方【文字说明】进行描述';
      break;
    default:
      data = '-';
      break;
  }
  return data;
});
