import { make } from 'react-lens';

make('orderStatus', 'string', (content) => {
  let data = '-';
  switch (content) {
    case '1':
      data = '待付款';
      break;
    case '2':
      data = '取消';
      break;
    case '3':
      data = '过期';
      break;
    case '4':
      data = '放币';
      break;
    case '5':
      data = '完成';
      break;
    case '6':
      data = '申诉中';
      break;
    default:
      data = '-';
      break;
  }
  return data;
});
