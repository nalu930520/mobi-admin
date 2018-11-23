import { make } from 'react-lens';

make('cashStatus', 'string', (content) => {
  let data = '-';
  switch (content) {
    case '0':
      data = '待付款';
      break;
    case '1':
      data = '待审核';
      break;
    case '2':
      data = '已完成';
      break;
    case '3':
      data = '已取消';
      break;
    case '4':
      data = '未知';
      break;
    default:
      data = '-';
      break;
  }
  return data;
});
