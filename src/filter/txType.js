import { make } from 'react-lens';

make('txType', 'string', (content) => {
  let data = '-';
  switch (content) {
    case '3':
      data = '预付卡快递费';
      break;
    case '4':
      data = '系统退款';
      break;
    case '5':
      data = 'Mobi转账';
      break;
    case '6':
      data = 'On-chain 发币';
      break;
    case '7':
      data = 'On-chain 收币';
      break;
    case '11':
      data = '币种兑换';
      break;
    case '12':
      data = '兑换撤销';
      break;
    case '13':
      data = '预付卡刷卡';
      break;
    case '14':
      data = '预付卡卡月费';
      break;
    case '15':
      data = '推特发送';
      break;
    case '16':
      data = '推特退款';
      break;
    case '18':
      data = '预付卡充值';
      break;
    case '19':
      data = 'C2C发送';
      break;
    case '20':
      data = 'C2C退款';
      break;
    default:
      data = '无效';
      break;
  }
  return data;
});
