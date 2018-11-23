import { make } from 'react-lens';

make('complaintOrderStatus', 'string', (content) => {
  let data = '-';
  switch (content) {
    case '1':
      data = '处理中';
      break;
    case '2':
      data = '已完成';
      break;
    case '3':
      data = '已取消';
      break;
    default:
      data = '-';
      break;
  }
  return data;
});
