import { make } from 'react-lens';

make('txStatus', 'string', (content) => {
  let data = '-';
  switch (content) {
    case '1':
      data = '待付款';
      break;
    case '2':
      data = '已付款';
      break;
    case '3':
      data = '处理中';
      break;
    case '4':
      data = '已完成';
      break;
    case '5':
      data = '已取消';
      break;
    case '6':
      data = '账号不存在';
      break;
    case '7':
      data = '无效';
      break;
    case '8':
      data = '未确认';
      break;
    case '9':
      data = '确认中';
      break;
    case '10':
      data = '拒绝';
      break;
    case '11':
      data = '延迟';
      break;
    default:
      data = '-';
      break;
  }
  return data;
});
