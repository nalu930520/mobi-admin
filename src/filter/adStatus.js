import { make } from 'react-lens';

make('adStatus', 'string', (content) => {
  let data = '-';
  switch (content) {
    case '1':
      data = '下架';
      break;
    case '2':
      data = '上架';
      break;
    case '-1':
      data = '删除';
      break;
    default:
      data = '-';
      break;
  }
  return data;
});
